var express = require('express');
var url = require('url');
var publishers = require('../publishers/index');

// router
var router = express.Router();

router
    .use(function(req, res, next) {
        res.promise = function(promise) {
            promise.then(function(result) {
                res.status(200).send(result);
            }).fail(function(err) {
                if (err.statusCode) {
                    res.status(err.statusCode).send({ error: err.message });
                } else {
                    res.status(500).send({ error: 'Unexpected error' });
                }
            }).done()
        };
        next();
    })
    .get('/har', function (req, res) {
        if (!url || !url.parse(req.query.serviceUrl).host) {
            res.status(400).send('Serivce url not valid');
            return;
        }

        var message = publishers.getMessageFromRequest(req);

        res.promise(publishers.publishRequestFromApi(message));
    })
    .put('/harTest', function (req, res) {
        console.log(req.body);
    });

module.exports = router;
