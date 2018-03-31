var express = require('express'); //load
var cluster = require('cluster');
var path = require('path');
var bodyParser = require('body-parser');
var AWS =  require('aws-sdk');


var app = express();
AWS.config.update({region: 'us-east-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var documentClient = new AWS.DynamoDB.DocumentClient();

var params = {
    ProjectionExpression: 'Lat, Lng',
    TableName: 'event_info'
};
var items;
documentClient.scan(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
       items = data.Items;
    }
});


// configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// use middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname,'bower_components/')));

app.get('/', function(req, res) {
    res.render('index', {
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});
app.get('/about', function(req, res) {
    res.render('about', {
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});
app.get('/map', function(req, res) {
    //console.log(items);
    res.render('map', {
        events: items,
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});
app.get('/user', function(req, res) {
    res.render('user', {
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

var port = process.env.PORT || 3000;


var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');

});
