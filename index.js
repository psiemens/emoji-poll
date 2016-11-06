var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var app = express();

var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io')(server);

var api = require('./routers/api'),
    polls = require('./routers/polls');

var socket = require('./controllers/socket');

// Connect to mongodb
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.use('/api', api);
app.use('/polls', polls);

io.on('connection', socket);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
