var Q = require('q');
var amqpUtils = require('../commons/amqpUtils');

// config
var connectionTypes = require('../config/connectionTypes');

// amqp
var channel;
var connection = amqpUtils.connect()
    .then(function(ch) {
        channel = ch;
        ch.assertQueue(amqpUtils.config.getQueueName);
    }).then(null, console.warn);

module.exports.getMessageFromRequest = function (req) {
    var connectionThrottleConfig = connectionTypes[req.query.connectionType] || connectionTypes.cable;
    var timestamp = new Date().getTime();

    if (req.query.connection) {
        connectionThrottleConfig = JSON.parse(req.query.connection);
    }

    return {
        serviceUrl: req.query.serviceUrl,
        hookUrl: req.query.hookUrl,
        connectionType: connectionThrottleConfig,
        timing: {
            messageQueried: new Date().getTime()
        }
    };
};

module.exports.publishRequestFromApi = function (message) {
    var deferred = Q.defer();

    channel.sendToQueue(
        amqpUtils.config.getQueueName,
        amqpUtils.jsonToBuffer(message),
        {replyTo: amqpUtils.config.sendQueueName},
        function (err, ok) {
            if (err) {
                deferred.reject({message: 'Request not queued', statusCode: 500});
            } else {
                deferred.resolve('Request queued');
            }
        }
    );

    return deferred.promise;
};
