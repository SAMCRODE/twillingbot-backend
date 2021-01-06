const config = require('../config/token');
const jwt = require('jsonwebtoken');

/**
 * Encrypt a message.
 * @param {string} data payload data in jwt.
 * @param {string} algorithm to be used on the token.
 * @return {string} A jwt token.
 */
function tokenize(data) {
  return jwt.sign({data},
      config.privateKey);
}

/**
 * Encrypt a message.
 * @param {string} jwt payload data in jwt.
 * @return {string} A promise that
 * returns the payload or a error if the token is invalid
 */
function decrypt(jwt) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, config.privateKey, function(err, decoded) {
      if (err) {
        return reject(new Error({err: err}));
      }

      return resolve(decoded);
    });
  });
}

module.exports = {
  tokenize: tokenize,
  decrypt: decrypt,
};
