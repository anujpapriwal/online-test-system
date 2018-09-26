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
  res.render('cancelClass', { title: 'Express'});
});

router.post('/', authenticationMiddleware(), function(req, res, next) {
  var hod = req.user.username;
  var username = req.body.username;
  var id = req.body.subId;
  User.findOneAndUpdate({username: username}, { $pull: {classes: {_id: id}}}, function(err, faculty){
    if(err){
      return err;
    }
    else{
      res.redirect('/cancelClass/' + username);
    }
  });
});

router.get('/:username', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  var username = req.params.username;
  var section = req.params.section;
  if(req.user.role == "HOD"){
    User.find({username: username}, function(err, faculty){
      if(err){
        return err;
      }
      else{
        res.render('cancelClass', { title: 'Express', faculty: faculty});
      }
    })
    }

  else {
    req.logout();
    }
});

module.exports = router;
