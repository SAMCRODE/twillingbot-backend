/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const userService = require('../services/user');

router.put('/register', function(req, res, next) {
  userService.register(req.body, function(code, msg) {
    return res.status(code).send(msg);
  });
});

module.exports = router;
