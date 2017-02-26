function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
exports.task1 = function task1(ret = {a: 0}) {
    console.log('task1=>normal function', ret);
    return {ret, task: 'task1'};
}
exports.task2_1 = function task2_1(ret) {
    console.log('task2_1=>Promise function', ret);
    return new Promise(resolve => {
        setTimeout(function() {
            resolve(Object.assign({}, ret, {task: 'task2_1'}));
        }, 100);
    });
}
exports.task2_2 = function task2_2(ret) {
    console.log('task2_2=>Promise function', ret);
    return new Promise(resolve => {
        setTimeout(function() {
            resolve(Object.assign({}, ret, {task: 'task2_2'}));
        }, 200);
    });
}

exports.task2_3 = function task2_3(ret) {
    console.log('task2_2=>Promise function', ret);
    return new Promise(resolve => {
        setTimeout(function() {
            resolve(Object.assign({}, ret, {task: 'task2_3'}));
        }, 10);
    });
}

exports.task3 = function* task3(ret) {
    yield sleep(1000);
    console.log('task3=>Generator Function', ret);
    return Object.assign(ret, {task: 'task3'});
};

exports.task4_1 = function* task4_1(ret) {
    yield sleep(1000);
    console.log('task4_1=>Generator Function', ret);
    return Object.assign(ret, {task: 'task4_1'});
};

exports.task4_2 = function* task4_2(ret) {
    yield sleep(200);
    console.log('task4_2=>Generator Function', ret);
    return Object.assign(ret, {task: 'task4_2'});
};

exports.task5 = function task5(ret1, ret2) {
    console.log('task5=>switch function', ret1, ret2);
    return Object.assign(ret1, {task: 'task6_2'});    
};

exports.task6_1 = function* task6_1(ret) {
    yield sleep(1000);
    console.log('task6_1=>Generator Function', ret);
    return Object.assign(ret, {task: 'task6_1'});
};

exports.task6_2 = function* task6_2(ret) {
    yield sleep(200);
    console.log('task6_2=>Generator Function', ret);
    return Object.assign(ret, {task: 'done task6_2'});
};

exports.task6_3 = function* task6_3(ret) {
    yield sleep(500);
    console.log('task6_3=>Generator Function', ret);
    return Object.assign(ret, {task: 'task6_3'});
};

exports.task7 = function* task7(ret) {
    yield sleep(500);
    console.log('task7=>Generator Function', ret);
    return Object.assign(ret, {task: 'task7'});
}