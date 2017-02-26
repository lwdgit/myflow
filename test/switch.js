const test = require('ava');
const flow = require('..');
test('switch', t => {
    return flow()
        .pipe(function (ret) {
            return {
                task: 'b'
            };
        })
        .pipe({
            a: function (ret) {
                console.log('a', ret);
                return 'a';
            },
            b: function (ret) {
                console.log('b', ret);
                return 'b';
            },
            c: function (ret) {
                console.log('c', ret);
                return 'c';
            }
        })
        .pipe(function (res) {
            t.is(res, 'b');
        })
        .run()
});