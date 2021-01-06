/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const botService = require('../services/bot');

router.get('/list', function(req, res, next) {
  botService.getBotList(function(code, msg) {
    return res.status(code).send(msg);
  });
});

// router.post('/tweet', function(req, res, next) {
//   botService.executeTweetOrder(req.body, function(code, msg) {
//     return res.status(code).send(msg);
//   });
// });

router.post('/follow', function(req, res, next) {
  botService.executeFollowOrder(req.body, function(code, msg) {
    return res.status(code).send(msg);
  });
});

router.post('/like', function(req, res, next) {
  botService.executeLikeOrder(req.body, function(code, msg) {
    return res.status(code).send(msg);
  });
});

router.post('/retweet', function(req, res, next) {
  botService.executeRetweetOrder(req.body, function(code, msg) {
    return res.status(code).send(msg);
  });
});

module.exports = router;
