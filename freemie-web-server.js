// FREEMIE WEB SERVER

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var htmlController = require('./controllers/html-controller');
var passport = require('./controllers/user-controller');
var route = require('./controllers/user-routes');
var config = require('./config')

var port = process.env.PORT || 8080;

app.disable('etag');
app.use('/assets', express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
app.set('trust proxy', true);

// -------- Implementing Passport -------------

app.use(cookieParser('freemienvc'));
app.use(bodyParser());
app.use(session({secret: 'freemienvc'}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/signin', route.signIn);
app.post('/signin', route.signInPost);
app.get('/signup', route.signUp);
app.post('/signup', route.signUpPost);
app.get('/signout', route.signOut);

// ------- All other routes -----------
htmlController(app);

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});


////// FOR CHAT
// the express app, which allows them to coexist.
// var io = require('socket.io').listen(app.listen(port, function() {
// 	var host = server.address().address;
// 	var port = server.address().port;
// 	console.log('App listening at http://%s:%s', host, port);
// }));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.
// require('./controllers/chat-controller')(app, io);

/********************************/

/********************************/
// 404 not found
app.use(route.notFound404);

// Initialize a new socket.io object. It is bound to 
