/* eslint-disable new-cap */
const conf = require('../config/database');
const express = require('express');
const router = express.Router();
// const postgres = require('pg');
// const sql = postgres(conf.conn);
/* GET home page. */

router.get('/', function(req, res, next) {
  teste();

  res.status(200).send('ola');
});

module.exports = router;
