/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const userService = require('../services/user');

router.post('/register', function(req, res, next) {
  userService.register(req.body, function(code, msg) {
    return res.status(code).send(msg);
  });
});

router.post('/forgot-password', function(req, res, next) {
  userService.sendCodeReset(req.body.email, function(code, msg) {
    return res.status(code).send(msg);
  });
});

router.post('/check-code', function(req, res, next) {
  userService.checkCode(req.body.email, req.body.code, function(code, msg) {
    return res.status(code).send(msg);
  });
});


router.post('/redefine-password', function(req, res, next) {
  userService.changePassword(req.body.email,
      req.body.code, req.body.newPass, function(code, msg) {
        return res.status(code).send(msg);
      });
});

module.exports = router;
