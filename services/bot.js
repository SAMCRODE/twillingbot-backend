const Bot = require('../models/bot');
const encrypt = require('../helpers/encrypt');
const Twit = require('twit');

/**
 * Register a bot.
 * @param {Bot} bot object to be saved.
 * @return {Promise} Promise with the id of bot on db or an error
 */
async function register(bot) {
  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  bot.apiKey = encrypt.cryptMessage(bot.apiKey);
  bot.apiSecretKey = encrypt.cryptMessage(bot.apiSecretKey);
  bot.accessToken = encrypt.cryptMessage(bot.accessToken);
  bot.accessSecretToken = encrypt.cryptMessage(bot.accessSecretToken);

  return new Promise(async function(resolve, reject) {
    T.get('users/show', {screen_name: bot.handle},
        async function(err, data, response) {
          if (err) {
            return new Error(err.message);
          }

          bot.name = data.name;
          bot.followersCount = data.followers_count;
          bot.profileImage = data.profile_image_url;

          try {
            const res = await Bot.save(bot);

            return resolve(res.res.id);
          } catch (e) {
            return reject(new Error(e.message));
          }
        });
  });
}

// eslint-disable-next-line require-jsdoc
async function getBotList(callback) {
  try {
    let list = await Bot.selectBotList();
    const bots = [];

    list = list.res;

    for (let i = 0; i < list.length; i++) {
      bots.push(new Bot(list[i].id, list[i].name, list[i].handle,
          list[i].profileimage, list[i].followerscount));
    }

    return callback(200, {res: bots});
  } catch (e) {
    return callback(500, {err: e.message, code: 'SERVEROFF'});
  }
}

module.exports = {
  register: register,
  getBotList: getBotList,
};
