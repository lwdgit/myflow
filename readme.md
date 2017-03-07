# myflow

> 异步流程控制库。


## 安装

> npm install myflow 

## 功能特色

  * 语法简洁，支持多级流程嵌套
  * 支持分支流程
  * 支持同步异步
  * 支持继承拓展
  * 支持数据传递combo传递
  * 支持两种书写形式(pipe与参数串连写法) [可以根据需求自行组织]
  

## Example

### simple

```
const flow = require('myflow');
flow(
    task1, 
    [task2, task3],
    flow(task4_1, task4_2),
    task5,
    {
        'task6_1': task6_1,
        'task6_2': task6_2
    }
)
.run();

```

### basic 
```
const flow = require('myflow');
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
flow()
.pipe(function () {
    return 'main';
})
.pipe(function* (ret) {
    yield sleep(200);
    console.log(3, ret);
    return 3;
})
.pipe(function (ret) {
    return new Promise(function (resolve, reject) {
        //some async function
        setTimeout(function () {
            resolve('done');
        }, 20);
    });
})
.pipe(function (ret) {
    console.log(ret);
})
.run();//不可少
```

### extends

```
const {
    Flow
} = require('myflow');
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
                    console.log('task2, 我有点慢。', ret++);
                    resolve(ret);
                }, 2000);
            })
        });
    }
    task3() {
        return this.pipe(function* (ret) {
            yield sleep(2000);
            console.log('task3, 我睡觉刚起来，等等', ret++);
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
            console.log('first', '强行插队');
            return ret ? ret : -10;
        })
    }
};

new MyFlow(1).task1().task2().task3().someTasks().first().then(function (ret) {
    console.log('我接收到啦', ret);
    return ret;
});

```

## API

### constructor(...tasks)
初始化时添加tasks，支持 Generator Function
``` 
flow(task1, task2).run();
```
### pipe(task: Function)
添加一个task
```
flow().pipe(task3).run();
```
### append(...tasks)
添加一批task
```
flow().append(task4, tasks5).run();
```

### prepend(...tasks)
往前添加task
```
flow().prepend(task0).run();
```

### run(initValue)
启动task。注：flow本身做为一个子task时不需要调用`run`方法。
```
flow(...tasks).run();
```

### all
启动task, 并收集所有流程的返回值。
```
flow(...tasks).all();
```

### static spread(args: Array) 静态方法
将 Array 数据平铺传递给下一级
```
flow([task1, task2], (ret1, ret2) => flow.spread([ret1, ret2]), (ret1, ret2) => task3)
```

### static resolve(...args) 静态方法
将参数平铺传递给下一级
```
flow([task1, task2], (ret1, ret2) => flow.resolve(ret1, ret2), (ret1, ret2) => task3)
```

## Features

### sync task
Task依次执行
```
flow(function(initValue) {
    return 1;
}, function(ret) {
    console.log(ret);// value is 1
}, function* () {
    yield sleep(1000);
    return 2;
}, function(ret) {
    console.log(ret);//value is 2
})
.run()
```

### async task
Task同时执行，执行时间以执行最长的task为准。
```
flow()
.pipe(initValue) {
    return 1;
})
.pipe([//并行执行开始
    function(ret) {
        console.log(ret);// value is 1
        return ret++;
    }, function* (ret) {
        yield sleep(1000);
        console.log(ret);// value is 1
        return ret++;
    }
])
.pipe(function(...ret) {
    console.log(ret);//value is [2, 2]
})
.run()
```

### group task
Task依次执行，执行结果以数据形式返回。
```
flow()
.pipe(initValue) {
    return 1;
})
.pipe(
    flow(
        function(ret) {
            console.log(ret);// value is 1
            return ret++;
        }, function* (ret) {
            yield sleep(1000);
            console.log(ret);// value is 2
            return ret++;
        }
    )
)
.pipe(function(...ret) {
    console.log(ret);//value is [2, 3]
})
.run()
```

### condition task 
条件执行，根据上一级task的返回值进行特定的下一级task。

```
flow(function() {
    return 'b';//return {task: 'b', otherParam: xxx}也行
})
.pipe({
    'a': function() {
        return 'a';
    },
    'b': function() {
        return 'b';
    }
    'defalut': function() {//当上一级的返回没有进入到任何一个时，执行default
        return 'defalut';
    }
})
.pipe(function(ret) {
    console.log(ret);// value is 'b';
});

```

### pipe与...args写法
flow也支持不用pipe的方式来连接任务。

如:
```
flow().pipe(task1).pipe(task2).run();
```
可以写成:
```
flow(task1, task2).run();
```

例二：
```
flow()
.pipe(task1)
.pipe([task2, task3])
.pipe(
    flow().pipe(task4_1).pipe(task4_2)
)
.pipe(task5)
.pipe({
    'task6_1': task6_1,
    'task6_2': task6_2
})
.run()
```

可以写成
```
flow(
    task1, 
    [task2, task3],
    flow(task4_1, task4_2),
    task5,
    {
        'task6_1': task6_1,
        'task6_2': task6_2
    }
).run()
```


更多详见 [test](./test)
