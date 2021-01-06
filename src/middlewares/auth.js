const config = require('../config/token');
const jwt = require('jsonwebtoken');

exports.authenticate = function(req, res, next) {
  const token = req.headers['authorization'];

  req.logado = false;

  if (!token) {
    return res.status(401)
        .send( {code: 'NEEDAUTH', msg: 'Token not provided'});
  }

  jwt.verify(token, config.privateKey, function(err, decoded) {
    if (err) {
      return res.status(401)
          .send({code: 'NEEDAUTH', msg: 'Invalid Token'});
    }

    next();
  });
};
