var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var flash = require('connect-flash');
var Test = require('../models/test');
var Assignment = require('../models/assignment');
var Answer = require('../models/answer');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Express'});
});

router.get('/:username', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  var now = new Date().toISOString();
  if(req.user.role == "student" ,user.username = req.params.username){

    Test.find({year: user.year, section: user.section, deadline: {$gt: now}}, function(err, test) {
      if (err) {
        return err;
      }
      else {
        Assignment.find({year: user.year, section: user.section, deadline: {$gt: now}}, function(err, assignment) {
          if (err) {
            return err;
          }
          else {
            Answer.find({username: req.user.username}, function(err, answer){
              if(err){
                return err;
              }
              else{
              res.render('dashboard', { title: 'Express', user: user, test: test, assignment: assignment, answer: answer, message: req.flash("message")});
              }
            })
          }
        });
      }
    });
  }
  else {
    req.logout();
  }
});


module.exports = router;
