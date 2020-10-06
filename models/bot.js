/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const pool = require('../helpers/database');
const NodeCache = require('node-cache');
const cache = new NodeCache();

class Bot {
  constructor(id, name, handle, profileImage, followersCount,
      apiKey=null, apiSecretKey=null, accessToken=null, accessSecretToken=null) {
    this.id = id;
    this.name = name;
    this.handle = handle;
    this.profileImage = profileImage;
    this.followersCount = followersCount;
    if (apiKey != null) {
      this.apiKey = apiKey;
      this.apiSecretKey = apiSecretKey;
      this.accessToken = accessToken;
      this.accessSecretToken = accessSecretToken;
    }
  }

  static save(bot) {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('INSERT INTO bots(name, handle, profileImage, followersCount, apiKey, apiSecretKey, accessToken' +
            ', accessSecretToken) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            [bot.name, bot.handle, bot.profileImage, bot.followersCount,
              bot.apiKey, bot.apiSecretKey,
              bot.accessToken, bot.accessSecretToken],
            (err, res) => {
              release();
              if (err) {
                console.log(err);
                return reject(new Error({err: err}));
              }

              return resolve({res: res.rows[0]});
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

            client.query('DELETE FROM bots where id = $1',
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

  static selectWhereId(id) {
    return new Promise(
        function(resolve, reject) {
          if (cache.has(`bot${id}`)) {
            return resolve(cache.get(`bot${id}`));
          }

          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('SELECT *FROM bots WHERE id = $1',
                [id], (err, res) => {
                  release();
                  if (err) {
                    return reject(new Error({err: err}));
                  }

                  cache.set(`bot${id}`, {res: res.rows[0]});
                  return resolve({res: res.rows[0]});
                });
          });
        });
  }

  static selectBotList() {
    return new Promise(
        function(resolve, reject) {
          if (cache.has(`botselect`)) {
            return resolve(cache.get(`botselect`));
          }

          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('SELECT id, name, handle, profileImage, followersCount FROM bots',
                [], (err, res) => {
                  release();
                  if (err) {
                    return reject(new Error({err: err}));
                  }

                  cache.set(`botselect`, {res: res.rows});
                  return resolve({res: res.rows});
                });
          });
        });
  }

  static deleteAll() {
    return new Promise(
        function(resolve, reject) {
          pool.connect((err, client, release) => {
            if (err) {
              return reject(new Error({err: err}));
            }

            client.query('DELETE FROM bots where id >= 1',
                [], (err, res) => {
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

module.exports = Bot;
