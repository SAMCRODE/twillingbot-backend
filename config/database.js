require('dotenv').config()

var config = {};

config.hosts = process.env.DB_HOSTS;
config.username = process.env.USERNAME;
config.password = process.env.PASSWORD;
config.databasename = process.env.DATABASE_NAME;
config.options = process.env.OPTIONS;

module.exports = config;