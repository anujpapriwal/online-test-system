var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  name: {
    type: String,
    unique: true,
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
  answers: [
    {
      qNo: Number,
      answer: String,
    }
  ],
  scored: {
    type: Number
  },
  numberOfQuestions: {
    type: Number,
    required: true
  },
  answeredTo : {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Answer', answerSchema);
