var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assignmentSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
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
  questions: [
    {
      qNo: Number,
      question: String,
    }
  ]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
