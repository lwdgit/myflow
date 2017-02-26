const test = require('ava');
const flow = require('..');
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function* subTask(input) {
    console.log(input);
    let ret = yield flow(function(arg) {
        return ++arg;
    }, function(arg) {
        console.log('su2', arg);
        return arg*=2;
    }).run(input);
    console.log('ret', ret);
    return ret;
}

test('test chain', function* (t) {
    let lst = yield flow(subTask, subTask).run(2);
    console.log('lst', lst);
});