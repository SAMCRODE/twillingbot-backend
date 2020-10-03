/* eslint-disable max-len */
require('dotenv').config();

const config = {};

config.passwordAlgorithm = process.env.PASSHASHALGO;

module.exports = config;
