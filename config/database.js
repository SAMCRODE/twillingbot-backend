/* eslint-disable max-len */
require('dotenv').config();

const config = {};

config.hosts = process.env.DB_HOSTS;
config.username = process.env.USERNAME;
config.password = process.env.PASSWORD;
config.databasename = process.env.DATABASE_NAME;
config.options = process.env.OPTIONS;
config.port = process.env.DATABASE_PORT;
config.conn = process.env.URI;

module.exports = config;
