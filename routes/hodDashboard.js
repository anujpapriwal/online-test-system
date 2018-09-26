var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/users');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.render('hodDashboard', { title: 'Express'});
});

router.get('/:username', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  if(req.user.role == "HOD"){
    User.find({role: 'faculty'}, function(err, faculties) {
      if (err) {
        return err;
      }
      else {
        User.find({role: 'student'}, function(err, students){
          if(err){
            return err;
          }
          else{
            res.render('hodDashboard', { title: 'Express', user: user, faculties: faculties, students: students});
          }
        })
      }
    });
  }
  else {
    req.logout();
  }
});


module.exports = router;
