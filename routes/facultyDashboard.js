var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var flash = require('connect-flash');
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
  res.render('facultyDashboard', { title: 'Express'});
});

router.get('/:username', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  if(req.user.role == "faculty"){
    Test.find({username: user.username}, function(err, test) {
      if (err) {
        return err;
      }
      else {
        Assignment.find({username: user.username}, function(err, assignment) {
          if (err) {
            return err;
          }
          else {
            res.render('facultyDashboard', { title: 'Express', user: user, test: test, assignment: assignment, messages: req.flash("message")});
          }
        });
      }
    });
  }
  else {
    req.logout();
  }
});

router.post('/', authenticationMiddleware(), function(req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  //mimic a slow network connection
  setTimeout(function(){

    var user = req.user;
    if(req.user.role == "HOD"||"faculty"){
      if(req.body.work == "test"){
        var testData = new Test({
          username: req.body.username,
          name: req.body.name,
          year: req.body.yearRadio,
          section: req.body.sectionRadio,
          subject: req.body.subject,
          deadline: req.body.deadline,
          timeLeft: req.body.time * 60
        });

        testData.save(function(err) {

          if(err){
            if (err.name === 'MongoError' && err.code === 11000) {
             // Duplicate username
             req.flash("message", "Test exists");
             res.redirect("/"+user.role+"Dashboard/"+user.username);
           }

           else {
             // Some other error
             console.log(err);
             console.log(req.body.name);
             req.flash("message", "Please try again with different entries");
             //return res.status(500).send(err);
             res.redirect("/"+user.role+"Dashboard/"+user.username);
             }
            }
            else {
              req.flash("message", "Test added");
              res.redirect("/"+user.role+"Dashboard/"+user.username);
            }
          });
      }
      else if(req.body.work == "assignment"){
        var assignmentData = new Assignment({
          username: req.body.username,
          name: req.body.name,
          year: req.body.yearRadio,
          section: req.body.sectionRadio,
          subject: req.body.subject,
          deadline: req.body.deadline
        });

        assignmentData.save(function(err) {

          if(err){
            if (err.name === 'MongoError' && err.code === 11000) {
             // Duplicate username
             req.flash("message", "Assignment exists");
             res.redirect("/"+user.role+"Dashboard/"+user.username);
           }

           else {
             // Some other error
             console.log(err);
             console.log(req.body.name);
             req.flash("message", "Please try again with different entries");
             //return res.status(500).send(err);
             res.redirect("/"+user.role+"Dashboard/"+user.username);
             }
            }
            else {
              req.flash("message", "Assignment added");
              res.redirect("/"+user.role+"Dashboard/"+user.username);
            }
          });
      }

      }

  else {
    req.logout();
  }
  }, 2000)
});

module.exports = router;
