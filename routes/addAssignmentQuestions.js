var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
  res.render('addAssignmentQuestions', { title: 'Express'});
});

router.get('/:name', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;

  if(req.user.role == "HOD"||"faculty"){
    Assignment.findOne({name: req.params.name}, function(err, assignment) {
      if (err) {
        return err;
      }
      else {
        res.render('addAssignmentQuestions', { title: 'Express', user: user, assignment: assignment, messages: req.flash("message")});
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
  var work = req.body.work;
  if(user.role == "HOD"||"faculty"){
    if(work == "delete"){
      Assignment.findOneAndUpdate({name: name}, { $pull: {questions: {qNo: req.body.id}}}, function(err, faculty){
        if(err){
          return err;
        }
        else{
          req.flash("message", "Question removed");
          res.redirect('/addAssignmentQuestions/'+name);
        }
      });
    }
    else{
      var inputQuestion = {
        qNo: req.body.id,
        question: req.body.question
      }
      Assignment.findOneAndUpdate({name: name}, { $push: {questions: inputQuestion}}, function(err, faculty){
        if(err){
          return err;
        }
        else{
          req.flash("message", "Question added");
          res.redirect('/addAssignmentQuestions/'+name);
        }
      });
    }
  }
  else {
    req.logout();
  }
});

module.exports = router;
