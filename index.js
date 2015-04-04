var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan')

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version"' +
    ' :status :res[content-length] ":referrer" ":user-agent" :response-time'
));

app.use('/metrics', require('./routes/metrics'));

var server = app.listen(3000);
