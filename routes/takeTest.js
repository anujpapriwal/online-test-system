var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Test = require('../models/test');
var Answer = require('../models/answer');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login');
  }
}

router.get('/:name/:number', authenticationMiddleware(), function(req, res, next) {
  var user = req.user;
  if(req.user.role == "HOD"||"faculty"){
    var name = req.params.name;
    var number = req.params.number;
    Test.findOne({name: name}, function(err, test) {
      if (err) {
        return err;
      }
      else {
        Answer.findOne({name: name, username: req.user.username}, function(err, sanswer){
          var length = test.questions.length;
          if(err){
            return err;
          }
          else{
            if(sanswer == null){
              if(number == length){
                var finish = true;
                exports.data = req.user;
                res.render('takeTest', { layout: 'testLayout', title: 'Express', messages: req.flash('message'), user: user, test: test, length: length, question: test.questions[number-1]});
              }
              else if (number > length) {
                res.redirect('/takeTest/'+name+'/'+'1');
              }
              else{
                var finish = false;
                exports.data = req.user;
                res.render('takeTest', { layout: 'testLayout', title: 'Express', messages: req.flash('message'), user: user, test: test, length: length, question: test.questions[number-1]});
              }
            }
            else{
              if(number == length){
                var finish = true;
                var newnum = parseInt(number);
                var alreadyPresent = sanswer.answers.find(o => o.qNo === newnum);
                exports.data = req.user;
                res.render('takeTest', { layout: 'testLayout', title: 'Express', messages: req.flash('message'), user: user, test: test, answer: alreadyPresent, length: length, question: test.questions[number-1]});
              }
              else if (number > length) {
                res.redirect('/takeTest/'+name+'/'+'1');
              }
              else{
                var finish = false;
                var newnum = parseInt(number);
                var alreadyPresent = sanswer.answers.find(o => o.qNo === newnum);
                exports.data = req.user;
                res.render('takeTest', { layout: 'testLayout', title: 'Express', messages: req.flash('message'), user: user, answer: alreadyPresent, test: test, length: length, question: test.questions[number-1]});
              }
            }
          }
        })
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
  var number = req.body.qno;
  var username = req.user.username;
  var TimeLeft = parseInt(req.body.timeLeft);

  if(user.role == "HOD"||"faculty||student"){
    Test.findOne({name: name}, function(err, test){
      if (err){
        return err;
      }
      else{
        var length = test.questions.length;

        Answer.findOne({username: username, name: name}, function(err, answer){
          //if theres no answer

            if(answer == null){

              res.setHeader('Content-Type', 'application/json');

              //mimic a slow network connection
              setTimeout(function(){

                var scored = 0;
                var newnum = parseInt(number);
                var requiredAnswer = test.questions.find(o => o.qNo === newnum);

                if(req.body.yearRadio == requiredAnswer.answer){
                  scored = scored + 1;
                }

                var answerData = new Answer({
                  username: req.user.username,
                  name: name,
                  year: req.user.year,
                  section: req.user.section,
                  subject: test.subject,
                  numberOfQuestions: length,
                  answered: true,
                  scored: scored,
                  answeredTo: req.body.to,
                  answers: [
                    {
                      qNo: req.body.qno,
                      answer: req.body.yearRadio
                    }
                  ]
                });

                answerData.save(function(err){
                  if(err){
                    return err;
                  }
                  else{
                    if(parseInt(number) < test.questions.length){
                      var num = parseInt(req.body.qno) + 1;
                      req.flash("message", "Answer submitted");

                      Test.findOneAndUpdate({_id:test._id}, {$set: {timeLeft: TimeLeft}});

                      res.redirect('/takeTest/'+name+'/'+num);
                    }
                    else{
                      Test.findOneAndUpdate({name: name}, {timeLeft: req.body.timeLeft});

                      req.flash("message", "Test complete");
                      res.redirect('/'+req.user.role+'Dashboard/'+req.user.username);
                    }
                  }
                })

              }, 2000)

            }

          //if there's an asnwer

            else{
              var inputAnswer = {
                qNo: req.body.qno,
                answer: req.body.yearRadio
              }

              var newnum = parseInt(number);
              var alreadyPresent = answer.answers.find(o => o.qNo === newnum);

              //if the input answer is already present
              if(alreadyPresent){
                Answer.findOneAndUpdate({name: name, username: username}, {$pull: {answers: {_id: alreadyPresent._id}}}, function(err, panswer){
                  if (err){
                    return err;
                  }
                  else{
                    var newnum = parseInt(number);
                    var requiredAnswer = test.questions.find(o => o.qNo === newnum);

                    if(req.body.yearRadio == requiredAnswer.answer && requiredAnswer.answer == alreadyPresent.answer){
                      var scored = panswer.scored;
                    }
                    else if (req.body.yearRadio == requiredAnswer.answer && requiredAnswer.answer !== alreadyPresent.answer) {
                      var scored = panswer.scored + 1;
                    }
                    else{
                      var scored = panswer.scored - 1;
                    }
                    Answer.findOneAndUpdate({name: name, username: username}, {$set: {scored: scored}, $push: {answers: inputAnswer}}, function(err, answer){
                      if(err){
                        return err;
                      }
                      else{

                        Test.findOneAndUpdate({_id:test._id}, {$set: {timeLeft: TimeLeft}});

                        var nextQ = parseInt(req.body.qno) + 1;
                        //if answer is less than length
                        if(number <= length){

                          Test.findOneAndUpdate({_id:test._id}, {$set: {timeLeft: TimeLeft}});

                          req.flash("message", "Answer submitted");
                          res.redirect('/takeTest/'+name+'/'+nextQ);
                        }
                        else if (number == length) {

                          Test.findOneAndUpdate({_id:test._id}, {$set: {timeLeft: TimeLeft}});

                          req.flash("message", "Test submitted");
                          res.redirect('/takeTest/'+name+'/1');
                        }
                      }
                    })
                  }
                })
              }

              //if the input asnwer is not present
              else if (!alreadyPresent) {

                Answer.findOne({name: name, username: username}, function(err, tanswer){
                  if(err){
                    return err;
                  }
                  else{
                    var inputAnswer = {
                      qNo: number,
                      answer: req.body.yearRadio
                    }
                    Answer.findOne({name: name, username: username}, function(err, panswer){
                      if(err){
                        return err;
                      }
                      else{
                        var newnum = parseInt(number);
                        var requiredAnswer = test.questions.find(o => o.qNo === newnum);

                        if(req.body.yearRadio == requiredAnswer.answer){
                          var scored = panswer.scored + 1;
                        }
                        else{
                          var scored = panswer.scored;
                        }
                        Answer.findOneAndUpdate({name: name, username: username}, {$set: {scored: scored}, $push: {answers: inputAnswer}}, function(err, answer){
                          if(err){
                            return err;
                          }
                          else{
                            var nextQ = parseInt(req.body.qno) + 1;
                            //if answer is less than length
                            if(number<length){

                              Test.findOneAndUpdate({_id:test._id}, {$set: {timeLeft: TimeLeft}});

                              req.flash("message", "Answer submitted");
                              res.redirect('/takeTest/'+name+'/'+nextQ);
                            }
                            else if (number = length) {

                              Test.findOneAndUpdate({_id:test._id}, {$set: {timeLeft: TimeLeft}});

                              req.flash("message", "Test submitted");
                              res.redirect('/takeTest/'+name+'/1');
                            }
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
        });
      }
    });
  }
  else {
    req.logout();
  }
});

module.exports = router;
