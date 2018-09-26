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
  res.render('classes', { title: 'Express'});
});

router.get('/:year/:section', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  var year = req.params.year;
  var section = req.params.section;
  if(req.user.role == "HOD"){
    User.find({role: 'student', year: year, section: section}, function(err, students){
      if(err){
        return err;
      }
      else{
        console.log(section);
        console.log(students);
        res.render('classes', { title: 'Express', user: user, students: students});
      }
    })
    }

  else {
    req.logout();
    }
});

module.exports = router;
