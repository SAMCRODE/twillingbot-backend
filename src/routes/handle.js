/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const handleService = require('../services/handle');

router.post('/confirm', function(req, res, next) {
  handleService.searchHandle(req.body.handle, function(code, msg) {
    return res.status(code).send(msg);
  });
});

module.exports = router;
