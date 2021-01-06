/* eslint-disable max-len */
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

/**
 * Encrypt a message.
 * @param {string} text message to be encrypted.
 * @param {string} algorithm the crypt algorithm.
 * @return {string} The encrypted message in hex.
 */
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(config.cryptoAlgo, Buffer.from(config.cryptoPass), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Encrypt a message.
 * @param {string} text message to be encrypted.
 * @param {string} algorithm the crypt algorithm.
 * @return {string} The decrypted message in utf8.
 */
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(config.cryptoAlgo, Buffer.from(config.cryptoPass), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

module.exports = {
  hashMessage: hashMessage,
  cryptMessage: encrypt,
  decryptMessage: decrypt,
};
