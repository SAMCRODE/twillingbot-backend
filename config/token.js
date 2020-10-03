/* eslint-disable max-len */
require('dotenv').config();

const config = {};

config.privateKey = process.env.TOKENPRIVATEKEY;
config.algorithm = process.env.TOKENALGORITHM;

module.exports = config;
