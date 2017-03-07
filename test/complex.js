const test = require('ava');
const flow = require('..');

const sleep = function (ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
}
test('test compose usage', t => {
    return flow(
        function* Task1() {
            yield sleep(2000);
            return 'a';
        }, [
            function Task2_1(ret) {
                console.log('2_1', ret)
                return 'b1';
            },
            function* t2_2(ret) {
                yield sleep(1000);
                console.log('2_2', ret)
                return 'd';
            },
            function Task2_3(ret) {
                console.log('2_3', ret)
                return 'zzzz';
            },
            flow(
                function Taks3_1(ret) {
                    console.log('3_1', ret);
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(5);
                        }, 500);
                    })
                },
                function Task3_2(ret) {
                    console.log('3_2', ret);
                    return 'c';
                }
            ),
            function* Task2_4(ret) {
                console.log('2_4', ret);
                return 'b3';
            }
        ],
        function Task4(...ret) {
            console.log('ret', ret);
            t.deepEqual(ret, ['b1', 'd', 'zzzz', [5, 'c'], 'b3']);
        }
    ).all().then(function (ret) {
        console.log('done', ret);
        t.deepEqual(ret, ['a', ['b1', 'd', 'zzzz', [5, 'c'], 'b3'], undefined]);
        return flow(
            function* Task1() {
                yield sleep(2000);
                return 'a';
            },
            flow(
                function Task2_1(ret) {
                    console.log('2_1', ret)
                    return 'b1';
                },
                function* t2_2(ret) {
                    yield sleep(1000);
                    console.log('2_2', ret)
                    return 'd';
                },
                function Task2_3(ret) {
                    console.log('2_3', ret)
                    return 'zzzz';
                },
                flow(
                    function Taks3_1(ret) {
                        console.log('3_1', ret);
                        return new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                resolve(5);
                            }, 500);
                        })
                    },
                    function Task3_2(ret) {
                        console.log('3_2', ret);
                        return 'c';
                    }
                ),
                function* Task2_4(ret) {
                    console.log('2_4', ret);
                    return 'b3';
                }
            ),
            function Task4(...ret) {
                console.log('ret', ret);
                return;
            }
        ).all();
    }).then(function (res) {
        console.log('done', res);
        t.deepEqual(res, ['a', ['b1', 'd', 'zzzz', [5, 'c'], 'b3'], undefined]);
        t.pass();
    }).catch(e => {
        console.error(e)
        t.fail();
    })
})