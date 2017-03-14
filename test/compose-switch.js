const test = require('ava');
const flow = require('..');

test('compose switch', t => {
    flow(function() {
        return {
            task: 'task1'
        }
    }, [
        {
            task1: function() {
                console.log(1);
            }
        },
        {
            task1: function() {
                console.log(2);
            }
        },
        {
            task2: function() {
                console.log('task2');
            },
            default: function() {
                console.log('default');
            }
        }
    ]).run();
});