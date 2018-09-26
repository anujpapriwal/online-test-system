var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  YoA: {
    type: Number,
  },
  section: {
    type: String,
  },
  year: {
    type: Number,
  },
  classes: [
    {
      year: Number,
      section: String,
      subject: String
    }
  ]
});

userSchema.pre('save', function (next) {
   var user = this;
   bcrypt.hash(user.password, 10, function (err, hash){
     if (err) {
       return next(err);
     }
     user.password = hash;
     next();
   })
 });

module.exports = mongoose.model('User', userSchema);
