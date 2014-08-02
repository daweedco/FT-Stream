var http = require('http'),
	fs = require('fs'),
	express = require('express'),
	ejs = require('ejs'),
	app = express(),
	routes = require('./routes'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	configDB = require('./config/database.js'),
	fs = require('fs');



// //Server on
// var server = http.createServer(app).listen(1234, function(){
// 	console.log("Express server listening on port 3000");
// });

var server = http.createServer(app).listen(3000,function (req, res) {
console.log("salut");
});

// Config
app.use('/public', express.static('public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser( { keepExtensions: true, uploadDir: '/public/pdf' } ));
module.exports.app = app;
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration
app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// Route
app.get('/', routes.index);
// app.get('/facebook', routes.facebook);


app.get('/eztv', routes.eztv);
app.post('/eztv', routes.eztv_search);
app.get('/eztv_dl', routes.eztv_dl);
app.get('/eztv_news', routes.eztv_news);

app.get('/tpb_search', routes.tpb_search);
app.post('/tpb_search', routes.tpb_search_p);
app.get('/tpb_dl', routes.tpb_dl);


