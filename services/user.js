/* eslint-disable require-jsdoc */
const userModel = require('../models/user');
const hash = require('../helpers/encrypt');

async function register(user, callback) {
  console.log(user);
  user.password = hash.hashMessage(user.password);

  try {
    const res = await userModel.save(user);

    return callback(200, {id: res.res.id, msg: 'Success'});
  } catch (e) {
    return callback(400, {err: e.message});
  }
}

module.exports = {
  register: register,
};
