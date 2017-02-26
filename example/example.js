const flow = require('..');
const {
    task1, task2_1, task2_2, task2_3, task3, task4_1, task4_2, task5, task6_1, task6_2, task6_3, task7
} = require('../test/_fixture');

module.exports = flow(
    task1, 
    [task2_1, task2_2, task2_3],//并行执行，结果以数组形式返回
    task3,
    flow(task4_1, task4_2),
    task5,//task5返回task6_2
    {//条件分支，根据上级返回的{task: xxx}决定，如果都没有命中，则走default
        'task6_1': flow(task6_1),
        'task6_2': flow(task6_2, flow(task7)),
        'default': task6_3
    }
).run(123, '456');