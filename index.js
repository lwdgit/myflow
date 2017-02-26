const Flow = require('./lib/flow');
global.Promise = require('bluebird');
function flow(...tasks) {
    return new Flow(...tasks);
}

flow.Flow = Flow;
flow.spread = Flow.spread;
flow.resolve = Flow.resolve;

module.exports = flow;