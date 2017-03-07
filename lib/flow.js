const co = require('co');
const Spread = function (args) {
    this.Array = args;
    return this;
};

const toString = {}.toString;

class Flow {
    constructor(...tasks) {
        this.tasks = tasks;
        this.tasks.__sync = true;
        if (!(this instanceof Flow)) {
            return new Flow(tasks);
        }
    }
    static spread(args) {
        return new Spread(args);
    }
    static resolve(...args) {
        return new Spread(args); 
    }
    _run(...initValue) {
        return this._dispatch(this.tasks, initValue);
    }
    all(...initValue) {
        return this._run(...initValue)
        .then(function(ret) {
            return ret.Array;
        });
    }
    run(...initValue) {
        return this._run(...initValue)
        .then(function(ret) {
            return ret.Array.pop(); 
        });
    }
    pipe(task) {
        this.tasks = [...this.tasks, task];
        this.tasks.__sync = true;
        return this;
    }
    _collect(value) {
        return value instanceof Spread ? value.Array : value;
    }
    _dispatch(tasks, initValue) {
        return new Promise((resolve, reject) => {
            co(function* () {
                initValue = yield initValue;
                if (Array.isArray(tasks)) {
                    var res = [];
                    if (tasks.__sync) {
                        //one by one
                        for (var task, ret = initValue; task = tasks.shift();) {
                            res = [...res, this._collect((ret = [yield this._dispatch(task, ret)])[0])];
                        }
                    } else {
                        //side by side
                        res = yield tasks.map(task => this._dispatch(task, initValue).then(ret => ret instanceof Spread ? ret.Array : ret));
                    }
                    return Flow.spread(res);

                } else if (toString.call(tasks) === '[object Object]' && !(tasks instanceof Flow)) {
                    //if tasks is Object, may a switch task
                    var _initValue = (initValue[0] || {}),
                        task, branchTask;
                        
                    _initValue = _initValue.Array ? _initValue.Array[0] : _initValue.task;
                    for (task in tasks) {
                        if (_initValue == task) {
                            branchTask = tasks[task];
                            break;
                        }
                        continue;
                    }
                    if (branchTask == null) {
                        branchTask = tasks['default'];
                    }
                    return this._dispatch(branchTask, initValue);

                } else {
                    return this.exec(tasks, initValue);
                }
            }.call(this)).then(resolve, reject);
        });
    }
    
    exec(task, initValue) {
        if (task instanceof Flow) {
            return task._run(...initValue);
        } else {
            if (!task) return;
            if (typeof task !== 'function') {
                console.error('Task Error:', task);
                return;
            }
            return co.wrap(task).apply(this, initValue.length > 0 && initValue[0] instanceof Spread ? initValue[0].Array : initValue);
        }
    }
    append(...tasks) {
        this.tasks = [...this.tasks, ...tasks];
        this.tasks.__sync = true;
        return this;
    }
    prepend(...tasks) {
        this.tasks = [...tasks, ...this.tasks];
        this.tasks.__sync = true;
        return this;
    }
}

module.exports = Flow;