const config = {};

config.smtpServer = process.env.SMTPSERVER;
config.user = process.env.USEREMAIL;
config.password = process.env.PASSWORDEMAIL;

module.exports = config;
