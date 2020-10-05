/* eslint-disable require-jsdoc */
const userModel = require('../models/user');
const hash = require('../helpers/encrypt');

async function register(user, callback) {
  user.password = hash.hashMessage(user.password);

  try {
    const us = await userModel.selectWhereEmail(user.email);

    if (us.res !== undefined) {
      return callback(400, {msg: 'Email already registered',
        code: 'EMAILREP'});
    }

    const res = await userModel.save(user);

    return callback(200, {id: res.res.id, msg: 'Success'});
  } catch (e) {
    return callback(500, {err: e.message, code: 'SERVEROFF'});
  }
}

module.exports = {
  register: register,
};
