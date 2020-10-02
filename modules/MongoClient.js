var conf = require('../config/database');
var MongoClient = require('mongodb').MongoClient;
var username = conf.username;
var password = conf.password;
var hosts = conf.hosts;
var database = conf.databasename;
var options = conf.options;
var connectionString = 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options;

module.exports = {
    MongoClient: MongoClient,
    connectionString: connectionString
}