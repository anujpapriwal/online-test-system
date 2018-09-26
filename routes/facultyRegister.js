var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var flash = require('connect-flash');
var User = require('../models/users');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

/* GET home page. */
router.post('/', function(req, res){
    res.setHeader('Content-Type', 'application/json');

    //mimic a slow network connection
    setTimeout(function(){

        var userData = new User({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: 'faculty',
          section: req.body.section,
          YoA: req.body.YoA,
          year: req.body.year
        });

        userData.save(function(err) {

          if(err){
            if (err.name === 'MongoError' && err.code === 11000) {
             // Duplicate username
             req.flash("message", "Username exists");
             res.redirect("/" + req.user.role + "Dashboard/"+req.user.username);
           }

           else {
             // Some other error
             req.flash("message", "Please try again with different credentials");
             //return res.status(500).send(err);
             res.redirect("/" + req.user.role + "Dashboard/"+req.user.username);
           }
          }
          else {
            res.redirect("/" + req.user.role + "Dashboard/"+req.user.username);
          }
        });

    }, 2000)

});

router.get('/', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  if(req.user.role == "HOD"){
    res.render('facultyRegister', { title: 'Express'});
  }
  else {
    req.logout();
  }
});

module.exports = router;
