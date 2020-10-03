const crypto = require('crypto');
const config = require('../config/hash');
/**
 * Encrypt a message.
 * @param {string} message messsage to be encrypted.
 * @param {string} algorithm the hash algorithm.
 * @return {string} The encrypted message in hex.
 */
function hashMessage(message, algorithm = config.passwordAlgorithm) {
  return crypto.createHash(algorithm).update(message).digest('hex');
}

module.exports = {
  hashMessage: hashMessage,
};
