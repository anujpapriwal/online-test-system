var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/users');
var Answer = require('../models/answer');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.render('showMarks', { title: 'Express'});
});

router.get('/:name/:year/:section', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  var year = req.params.year;
  var section = req.params.section;
  if(req.user.role == "HOD"||"faculty"){
    Answer.find({answeredTo: user.username, name: req.params.name, year: year, section: section}, function(err, answer){
      if(err){
        return err;
      }
      else{
        res.render('showMarks', { title: 'Express', answers: answer, year: year, user: user, section: section, messages: req.flash("message")});
      }
    })
    }

  else {
    req.logout();
    }
});

router.post('/', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  if(user.role == "HOD"||"faculty"){
    Answer.findOneAndRemove({_id: req.body.name}, function(err, faculty){
      if(err){
        return err;
      }
      else{
        req.flash("message", "Attempt removed");
        res.redirect('/showMarks/'+req.body.year+'/'+req.body.section);
      }
    });
  }
  else {
    req.logout();
  }
});

module.exports = router;
