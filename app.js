// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var expressSession = require('express-session');
// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
var app      = express();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

var monk = require('monk');
var db = monk(configDB.url);

// ========================== File Upload ======================================

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/** Serving from the same express Server
 No cors required */
//app.use(express.static('../client'));

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
  upload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({error_code:0,err_desc:null});
  })

});

// =============================================================================

require('./config/passport')(passport); // pass passport for configuration

var event_users = require('./routes/web_services/users')(app, express);
var events = require('./routes/web_services/events'); (app, express);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: "mywifeisagunstar",
  resave: true,
  saveUninitialized: true
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

//app.use('/', routes);

// routes ======================================================================
require('./routes/login.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/dashboard.js')(app, passport);
require('./routes/signup.js')(app, passport);
require('./routes/user_signup.js')(app, express);
require('./routes/user-list.js')(app, express);

// Web-service Calls
app.use('/web_services/users', event_users);
app.use('/web_services/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


