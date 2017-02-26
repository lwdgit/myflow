const test = require('ava');
const flow = require('..');
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
test('spread', t => {
    return flow([function () {
            return 1;
        }, function* (ret) {
            return 2;
        }],
        function(first, second) {
            console.log('main', first, second);
            t.is(first, 1);
            t.is(second, 2);
            return 'done';
        }
    ).run().then(function (...ret) {
        console.log('end', ret);
    });
});