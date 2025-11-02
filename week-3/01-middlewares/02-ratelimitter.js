const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// rate limit the requests from a user to only 5 request per second
// If a user sends more than 5 requests in a single second, the server
// should block them with a 404.
// User will be sending in their user id in the header as 'user-id'
// You have been given a numberOfRequestsForUser object to start off with which
// clears every one second

let numberOfRequestsForUser = {};
const rateLimiterMiddleware = (req, res, next) => {
  let userId;
  try{
    userId = req.headers['user-id'];
  }catch(err){
    res.status(400).json({
      msg: "User Id missing in headers"
    })
  }
  if(numberOfRequestsForUser[userId] === undefined) {
    numberOfRequestsForUser[userId] = 1;
  }else{
    numberOfRequestsForUser[userId]++;
  }
  console.log(`User ID: ${userId}, Requests: ${numberOfRequestsForUser[userId]}`);
  if(numberOfRequestsForUser[userId] > 5) {
    res.status(404).json({
      msg: "Rate Limit Exceeded"
    })
  }else{
    next();
  }
  
}
app.use(rateLimiterMiddleware);
setInterval(() => {
    numberOfRequestsForUser = {};
}, 1000)

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});

app.post('/user', function(req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});

app.listen(3000);
module.exports = app;