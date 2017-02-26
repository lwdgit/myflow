const {
    Flow
} = require('..');
const test = require('ava');
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

class MyFlow extends Flow {
    constructor(args) {
        super(function () {
            console.log('run with Args', args);
            return args;
        });
        let ins;
        process.nextTick(() => {
            ins = this.run();
        });
    }
    task1() {
        return this.pipe(function (ret) {
            console.log('task1', ret++);
            return ret;
        });
    }
    task2() {
        return this.pipe(function (ret) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('task2, tooooo slow...。', ret++);
                    resolve(ret);
                }, 2000);
            })
        });
    }
    task3() {
        return this.pipe(function* (ret) {
            yield sleep(2000);
            console.log('task3, wait wait...', ret++);
            return ret;
        })
    }
    someTasks() {
        return this.append(function* (ret) {
            console.log('task4', ret++);
            return ret;
        }, function (ret) {
            console.log('task5', ret);
            return ret * ret;
        });
    }
    then(fn) {
        return this.pipe(fn);
    }
    first() {
        return this.prepend(function (ret) {
            console.log('first', 'I am NO.1');
            return ret ? ret : -10;
        })
    }
};

test('test extend', function* (t) {
    let ret = yield new MyFlow(1).task1().task2().task3().someTasks().first().then(function (ret) {
        console.log('I got it', ret);
        return ret;
    });
    console.log(ret);
    t.is(ret, 25);
});