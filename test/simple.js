const test = require('ava');
const flow = require('..');
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('simple', t => {
    return flow(
        function* (ret) {
            console.log(1);
            return 1;
        },
        function* (ret) {
            yield sleep(1000);
            console.log(2);
            return 2;
        },
        function* (ret) {
            yield sleep(200);
            console.log(3);
            return 3;
        },
        function (ret) {
            return new Promise(function (resolve, reject) {
                //some async function
                setTimeout(function () {
                    resolve('done');
                }, 20);
            });
        },
        function (ret) {
            console.log(ret);
            t.is(ret, 'done');
        }
    ).run();
});