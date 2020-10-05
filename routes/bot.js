/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const botService = require('../services/bot');

router.get('/list', function(req, res, next) {
  botService.getBotList(function(code, msg) {
    return res.status(code).send(msg);
  });
});

module.exports = router;
