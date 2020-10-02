var MongoClient = require('../modules/MongoClient').MongoClient;
var conn = require('../modules/MongoClient').connectionString;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(conn, function(err, db) {
    if (db) {
        db.close();
    }
    if (err) {
      console.log(err);
      return res.render('index', { title: 'Error' });
    } else {
      return res.render('index', { title: 'Connected' });
    }
  });

});

module.exports = router;
