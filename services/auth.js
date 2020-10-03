/* eslint-disable require-jsdoc */
const userModel = require('../models/user');
const hash = require('../helpers/encrypt');
const token = require('../helpers/token');

async function login(user, callback) {
  user.password = hash.hashMessage(user.password);

  try {
    const res = await userModel.selectWhereEmail(user.email);

    if (!!!res.res || res.res.password !== user.password) {
      return callback(400, {msg: 'Wrong Credentials', code: 'AUTHWR'});
    }

    user.id = res.res.id;
    return callback(200, {
      msg: 'Success', user: user,
      jwt: token.tokenize(user)});
  } catch (e) {
    return callback(500, {msg: 'Server off', code: 'SERVEROFF'});
  }
}

module.exports = {
  login: login,
};
