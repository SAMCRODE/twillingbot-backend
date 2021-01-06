/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

router.post('/', function(req, res, next) {
  authService.login(req.body, function(code, msg) {
    return res.status(code).send(msg);
  });
});

module.exports = router;
