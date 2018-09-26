var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Test = require('../models/test');
var Assignment = require('../models/assignment');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.render('addQuestions', { title: 'Express'});
});

router.get('/:name', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  if(req.user.role == "HOD"||"faculty"){
    var name = req.params.name;
    Test.findOne({name: name}, function(err, test) {
      if (err) {
        return err;
      }
      else {
        res.render('addQuestions', { title: 'Express', user: user, test: test, messages: req.flash("message")});
      }
    });
  }
  else {
    req.logout();
  }
});

router.post('/', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  var name = req.body.name;
  if(user.role == "HOD"||"faculty"){
    var inputQuestion = {
      qNo: req.body.id,
      question: req.body.question,
      option1: req.body.option1,
      option2: req.body.option2,
      option3: req.body.option3,
      option4: req.body.option4,
      answer: req.body.answer
    }
    Test.findOneAndUpdate({name: name}, { $push: {questions: inputQuestion}}, function(err, faculty){
      if(err){
        return err;
      }
      else{
        req.flash("message", "Question added");
        res.redirect('/addQuestions/'+name);
      }
    });
  }
  else {
    req.logout();
  }
});

module.exports = router;
