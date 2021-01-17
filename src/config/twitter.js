const config = {};

config.consumerKey = process.env.APIKEY;
config.consumerSecret = process.env.APISECRETKEY;
config.accessToken = process.env.ACCESSTOKEN;
config.accessTokenSecret = process.env.ACCESSSECRETTOKEN;

module.exports = config;
