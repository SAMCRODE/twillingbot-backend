/* eslint-disable require-jsdoc */

const pool = require('../helpers/database');

class User {
  constructor(id, email, password, codePassReset) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.codepassreset = codePassReset;
  }

  static save(user) {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('INSERT INTO users(email, password)' +
            ' VALUES($1, $2) RETURNING id',
            [user.email, user.password], (err, res) => {
              release();
              if (err) {
                return reject(new Error({err: err}));
              }

              return resolve({res: res.rows[0]});
            });
          });
        });
  }

  static selectWhereEmail(email) {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('SELECT *FROM users WHERE email = $1',
                [email], (err, res) => {
                  release();
                  if (err) {
                    return reject(new Error({err: err}));
                  }

                  return resolve({res: res.rows[0]});
                });
          });
        });
  }

  static updateCodePassReset(code, id) {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('UPDATE users' +
          ' SET codePassReset = $1 where id = $2 ',
            [code, id], (err, res) => {
              release();
              if (err) {
                console.log(err);
                return reject(new Error({err: err}));
              }

              return resolve();
            });
          });
        });
  }

  static updatePassword(pass, id) {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('UPDATE users' +
          ' SET password = $1 where id = $2 ',
            [pass, id], (err, res) => {
              release();
              if (err) {
                console.log(err);
                return reject(new Error({err: err}));
              }

              return resolve();
            });
          });
        });
  }

  static delete(id) {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('DELETE FROM users where id = $1',
                [id], (err, res) => {
                  release();
                  if (err) {
                    return reject(new Error({err: err}));
                  }

                  return resolve({});
                });
          });
        });
  }
}

module.exports = User;
