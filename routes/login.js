var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/users');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
function(username, password, next) {

 User.findOne({'username': username}, function(err, user){
  if(err) {
    throw err;
  }
  if(!user){
    return next(null, false, {message: 'Unknown User'});
  }
  else{
    bcrypt.compare(password, user.password, function(err, isMatch) {
      if(err) {
        throw err;
      }
      if(isMatch === true){
        return next(null, user, {message: 'Authenticated'});
      }
      else if(isMatch === false) {
        return next(null, false, {message: 'Invalid password'});
      }
    });
  }
});
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err, null);
    });
});


router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}) , function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
      //res.send(error);
      var user = req.user;
      if(user.role == "HOD"){
        res.redirect('/HODDashboard/' + req.user.username);
      }
      else if(user.role == 'faculty'){
        res.redirect('/facultyDashboard/' + req.user.username);
      }
      else {
        res.redirect('/studentDashboard/' + req.user.username);
      }

  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express'});
});

module.exports = router;
