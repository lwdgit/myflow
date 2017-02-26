const test = require('ava');
const flow = require('..');

test('test example', function*(t) {
    yield require('../example/example.js');
});