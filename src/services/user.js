/* eslint-disable require-jsdoc */
const userModel = require('../models/user');
const hash = require('../helpers/encrypt');
const emailService = require('./email');

async function register(user, callback) {
  if (user.email.length === 0 || user.password.length === 0) {
    return callback(400, {msg: 'Wrong values', code: 'WRVALS'});
  }

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

async function sendCodeReset(email, callback) {
  try {
    let us = await userModel.selectWhereEmail(email);

    if (us.res === undefined) {
      return callback(400, {msg: 'Email não registrado',
        code: 'AUTHWR'});
    }
    us = us.res;

    const code = Math.random().toString(10).substring(2, 8);
    await userModel.updateCodePassReset(code, us.id);
    emailService.sendResetPassEmail(code, email);

    return callback(200, {msg: 'Success'});
  } catch (e) {
    return callback(500, {err: e.message, code: 'SERVEROFF'});
  }
}

async function checkCode(email, code, callback) {
  try {
    const us = await userModel.selectWhereEmail(email);

    if (us.res === undefined) {
      return callback(400, {msg: 'Email não registrado',
        code: 'AUTHWR'});
    }

    if (code !== us.res.codepassreset) {
      return callback(400, {msg: 'Código inválido',
        code: 'AUTHWR'});
    }

    return callback(200, {msg: 'Success'});
  } catch (e) {
    return callback(500, {err: e.message, code: 'SERVEROFF'});
  }
}

async function changePassword(email, code, newPass, callback) {
  try {
    const us = await userModel.selectWhereEmail(email);

    if (us.res === undefined) {
      return callback(400, {msg: 'Email não registrado',
        code: 'AUTHWR'});
    }

    if (code !== us.res.codepassreset) {
      return callback(400, {msg: 'Código inválido',
        code: 'AUTHWR'});
    }
    newPass = hash.hashMessage(newPass);

    await userModel.updatePassword(newPass, us.res.id);

    return callback(200, {msg: 'Success'});
  } catch (e) {
    console.log(e);
    return callback(500, {err: e.message, code: 'SERVEROFF'});
  }
}

module.exports = {
  register: register,
  sendCodeReset: sendCodeReset,
  checkCode,
  changePassword: changePassword,
};
