var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  timeLeft : {
    type: Number,
    required: true
  },
  answered: {
    type: Boolean
  },
  questions: [
    {
      qNo: Number,
      question: String,
      option1: String,
      option2: String,
      option3: String,
      option4: String,
      answer: String
    }
  ]
});

module.exports = mongoose.model('Test', testSchema);
