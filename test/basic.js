const test = require('ava');
const flow = require('..');
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
test('basic', t => {
    return flow()
        .pipe(function () {
            return 'main';
        })
        .pipe(function* (ret) {
            console.log(1, ret);
            return 1;
        })
        .pipe(function* (ret) {
            yield sleep(1000);
            console.log(2, ret);
            return 2;
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
            t.is(ret, 'done');
        }).run();
});