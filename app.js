var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var helmet = require('helmet');
var flash = require('connect-flash');
var Schema = mongoose.Schema;
var passport = require('passport');
var Handlebars = require('handlebars');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var dashboard = require('./routes/dashboard');
var facultyRegister = require('./routes/facultyRegister');
var facultyDashboard = require('./routes/facultyDashboard');
var hodDashboard = require('./routes/hodDashboard');
var logout = require('./routes/logout');
var assignClass = require('./routes/assignClass');
var showClass = require('./routes/showClass');
var cancelClass = require('./routes/cancelClass');
var addAssignmentQuestions = require('./routes/addAssignmentQuestions');
var addQuestions = require('./routes/addQuestions');
var removeTest = require('./routes/removeTest');
var removeAssignment = require('./routes/removeAssignment');
var takeTest = require('./routes/takeTest');
var showMarks = require('./routes/showMarks');

var app = express();
var db = mongoose.connect('mongodb://localhost/test', function(error){
    if(error) console.log(error);

        console.log("connection successful");
});

// view engine setup
app.engine('hbs' , hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  maxAge: 300
}));

//custom handlebars counter start from 1
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/studentDashboard', dashboard);
app.use('/facultyRegister', facultyRegister);
app.use('/facultyDashboard', facultyDashboard);
app.use('/logout', logout);
app.use('/HODDashboard', hodDashboard);
app.use('/assignClass', assignClass);
app.use('/Class', showClass);
app.use('/cancelClass', cancelClass);
app.use('/addAssignmentQuestions', addAssignmentQuestions);
app.use('/addQuestions', addQuestions);
app.use('/removeTest', removeTest);
app.use('/takeTest', takeTest);
app.use('/removeAssignment', removeAssignment);
app.use('/showMarks', showMarks);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
