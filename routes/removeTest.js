var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Test = require('../models/test');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

router.get('/:name', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  var name = req.params.name;
  if(user.role == "HOD"||"faculty"){
    Test.remove({name: name}, function(err, faculty){
      if(err){
        return err;
      }
      else{
        req.flash("message", "Test deleted");
        res.redirect('/' + user.role + 'Dashboard/' + user.username);
      }
    });
  }
  else {
    req.logout();
  }
});

module.exports = router;
