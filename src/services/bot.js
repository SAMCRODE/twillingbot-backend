const Bot = require('../models/bot');
const encrypt = require('../helpers/encrypt');
const Twit = require('twit');

/**
 * crypt bot tokens
 * @param {Bot} bot
 * @return {Bot} crypted
 */
function cryptBot(bot) {
  bot.apiKey = encrypt.cryptMessage(bot.apikey);
  bot.apiSecretKey = encrypt.cryptMessage(bot.apisecretkey);
  bot.accessToken = encrypt.cryptMessage(bot.accesstoken);
  bot.accessSecretToken = encrypt.cryptMessage(bot.accesssecrettoken);

  return bot;
}

/**
 * decrypt bot tokens
 * @param {Bot} bot
 * @return {Bot} decrypted
 */
function decryptBot(bot) {
  bot.apiKey = encrypt.decryptMessage(bot.apikey);
  bot.apiSecretKey = encrypt.decryptMessage(bot.apisecretkey);
  bot.accessToken = encrypt.decryptMessage(bot.accesstoken);
  bot.accessSecretToken = encrypt.decryptMessage(bot.accesssecrettoken);

  return bot;
}

/**
 * create Twit object
 * @param {Bot} bot
 * @return {Twit} obj with credentials from bot
 */
function getTwitObj(bot) {
  return new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });
}

// eslint-disable-next-line require-jsdoc
async function getUserIdFromHandle(bot, handle) {
  const T = getTwitObj(bot);

  return new Promise(async function(resolve, reject) {
    T.get('users/show', {screen_name: handle},
        async function(err, data, response) {
          if (err) {
            return reject(new Error(err.message));
          }

          return resolve(data.id_str);
        });
  });
}

/**
 * Register a bot.
 * @param {Bot} bot object to be saved.
 * @return {Promise} Promise with the id of bot on db or an error
 */
async function register(bot) {
  const T = getTwitObj(bot);

  bot = cryptBot(bot);

  return new Promise(async function(resolve, reject) {
    T.get('users/show', {screen_name: bot.handle},
        async function(err, data, response) {
          if (err) {
            console.log(err);
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

/**
 * make a tweet
 * @param {Bot} bot to make the tweet from.
 * @param {string} text text to be tweeted
 * @return {Promise} Promise returns error if some error ocurred
 */
async function tweet(bot, text) {
  const T = getTwitObj(bot);

  return new Promise(function(resolve, reject) {
    T.post('statuses/update',
        {status: text}, function(err, data, response) {
          if (err) {
            // console.log(err.message);
            return reject(new Error(err.message));
          }

          return resolve(bot.handle);
        });
  });
}

/**
 * like a tweet
 * @param {Bot} bot to make the tweet from.
 * @param {string} tweetId tweet identifier
 * @return {Promise} Promise returns error if some error ocurred
 */
async function like(bot, tweetId) {
  const T = getTwitObj(bot);

  return new Promise(function(resolve, reject) {
    T.post('favorites/create',
        {id: tweetId}, function(err, data, response) {
          if (err) {
            // console.log(err.message);
            return reject(new Error(err.message));
          }

          return resolve(bot.handle);
        });
  });
}

/**
 * retweet a tweet
 * @param {Bot} bot to make the retweet.
 * @param {string} tweetId tweet identifier
 * @return {Promise} Promise returns error if some error ocurred
 */
async function retweet(bot, tweetId) {
  const T = getTwitObj(bot);

  return new Promise(function(resolve, reject) {
    T.post('statuses/retweet',
        {id: tweetId}, function(err, data, response) {
          if (err) {
            // console.log(err.message);
            return reject(new Error(err.message));
          }

          return resolve(bot.handle);
        });
  });
}

/**
 * follow someone
 * @param {Bot} bot to make the follow from.
 * @param {string} handle the twitter account with handle to be followed
 * @return {Promise} Promise returns error if some error ocurred
 */
async function follow(bot, handle) {
  const T = getTwitObj(bot);

  const id = await getUserIdFromHandle(bot, handle);

  return new Promise(function(resolve, reject) {
    T.post('friendships/create',
        {user_id: id}, function(err, data, response) {
          if (err) {
            return reject(new Error(err.message));
          }
          return resolve(bot.handle);
        });
  });
}

// eslint-disable-next-line require-jsdoc
async function executeTweetOrder(tweetOrder, callback) {
  const text = tweetOrder.tweet;
  let bots = tweetOrder.botIds;

  bots = await Promise.all(bots.map(async (bot) => {
    bot = await Bot.selectWhereId(bot);
    bot = bot.res;

    bot = decryptBot(bot);
    // console.log(bot);
    return bot;
  }));

  await Promise.allSettled(bots.map(async (bot) => {
    return new Promise(async function(resolve, reject) {
      try {
        const ret = await tweet(bot, text);
        return resolve(ret);
      } catch (e) {
        return reject(new Error(e));
      }
    });
  })).then((values) => {
    const performed = values.reduce((total, x) =>
      (x.status === 'fulfilled' ? total + 1 : total), 0);
    return callback(200, {performed: performed});
  });
}

// eslint-disable-next-line require-jsdoc
async function executeLikeOrder(likeOrder, callback) {
  let handle = likeOrder.handle;
  let bots = likeOrder.botIds;

  bots = await Promise.all(bots.map(async (bot) => {
    bot = await Bot.selectWhereId(bot);
    bot = bot.res;

    bot = decryptBot(bot);
    // console.log(bot);
    return bot;
  }));

  const bot = bots[0];

  const T = getTwitObj(bot);

  if (handle.startsWith('@')) {
    handle = handle.substr(1);
  }

  T.get('users/lookup',
      {screen_name: `${handle}`, result_type: 'recent',
        count: 3}, async function(err, data, response) {
        await Promise.allSettled(bots.map((bot) => {
          const tweetData = data[0].status;
          return like(bot, tweetData.id_str);
        })).then((values) => {
          const performed = values.reduce((total, x) =>
            (x.status === 'fulfilled' ? total + 1 : total), 0);
          return callback(200, {performed: performed});
        });
      });
}

// eslint-disable-next-line require-jsdoc
async function executeRetweetOrder(retweetOrder, callback) {
  let handle = retweetOrder.handle;
  let bots = retweetOrder.botIds;

  bots = await Promise.all(bots.map(async (bot) => {
    bot = await Bot.selectWhereId(bot);
    bot = bot.res;

    bot = decryptBot(bot);
    // console.log(bot);
    return bot;
  }));

  const bot = bots[0];

  const T = getTwitObj(bot);

  if (handle.startsWith('@')) {
    handle = handle.substr(1);
  }

  T.get('users/lookup',
      {screen_name: `${handle}`, result_type: 'recent',
        count: 3}, async function(err, data, response) {
        // console.log(data);

        await Promise.allSettled(bots.map((bot) => {
          const tweetData = data[0].status;
          return retweet(bot, tweetData.id_str);
        })).then((values) => {
          const performed = values.reduce((total, x) =>
            (x.status === 'fulfilled' ? total + 1 : total), 0);
          return callback(200, {performed: performed});
        });
      });
}

// eslint-disable-next-line require-jsdoc
async function executeFollowOrder(tweetOrder, callback) {
  const handle = tweetOrder.handle;
  let bots = tweetOrder.botIds;

  bots = await Promise.all(bots.map(async (bot) => {
    bot = await Bot.selectWhereId(bot);
    // console.log(bot, 'eh o bot');
    bot = bot.res;

    bot = decryptBot(bot);
    // console.log(bot);
    return bot;
  }));

  await Promise.allSettled(bots.map((bot) => {
    return follow(bot, handle);
  })).then((values) => {
    const performed = values.reduce((total, x) =>
      (x.status === 'fulfilled' ? total + 1 : total), 0);

    return callback(200, {performed: performed});
  });
}

module.exports = {
  register: register,
  getBotList: getBotList,
  tweet: tweet,
  executeTweetOrder: executeTweetOrder,
  executeFollowOrder: executeFollowOrder,
  executeLikeOrder: executeLikeOrder,
  executeRetweetOrder: executeRetweetOrder,
};
