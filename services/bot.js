const Bot = require('../models/bot');
const encrypt = require('../helpers/encrypt');
const Twit = require('twit');

// eslint-disable-next-line require-jsdoc
async function getUserIdFromHandle(bot, handle) {
  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

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

/**
 * make a tweet
 * @param {Bot} bot to make the tweet from.
 * @param {string} text text to be tweeted
 * @return {Promise} Promise returns error if some error ocurred
 */
async function tweet(bot, text) {
  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  return new Promise(function(resolve, reject) {
    T.post('statuses/update',
        {status: text}, function(err, data, response) {
          if (err) {
            // console.log(err.message);
            return reject(new Error(err.message));
          }

          return resolve(bot.id);
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
  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  return new Promise(function(resolve, reject) {
    T.post('favorites/create',
        {id: tweetId}, function(err, data, response) {
          if (err) {
            // console.log(err.message);
            return reject(new Error(err.message));
          }

          return resolve();
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
  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  return new Promise(function(resolve, reject) {
    T.post('statuses/retweet',
        {id: tweetId}, function(err, data, response) {
          if (err) {
            // console.log(err.message);
            return reject(new Error(err.message));
          }

          return resolve();
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
  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  const id = await getUserIdFromHandle(bot, handle);

  return new Promise(function(resolve, reject) {
    T.post('friendships/create',
        {user_id: id}, function(err, data, response) {
          if (err) {
            return reject(new Error(err.message));
          }
          return resolve(bot.id);
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

    bot.apiKey = encrypt.decryptMessage(bot.apikey);
    bot.apiSecretKey = encrypt.decryptMessage(bot.apisecretkey);
    bot.accessToken = encrypt.decryptMessage(bot.accesstoken);
    bot.accessSecretToken = encrypt.decryptMessage(bot.accesssecrettoken);
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
    return callback(200, values);
  });
}

// eslint-disable-next-line require-jsdoc
async function executeLikeOrder(likeOrder, callback) {
  let handle = likeOrder.handle;
  let bots = likeOrder.botIds;

  bots = await Promise.all(bots.map(async (bot) => {
    bot = await Bot.selectWhereId(bot);
    bot = bot.res;

    bot.apiKey = encrypt.decryptMessage(bot.apikey);
    bot.apiSecretKey = encrypt.decryptMessage(bot.apisecretkey);
    bot.accessToken = encrypt.decryptMessage(bot.accesstoken);
    bot.accessSecretToken = encrypt.decryptMessage(bot.accesssecrettoken);
    // console.log(bot);
    return bot;
  }));

  const bot = bots[0];

  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  if (handle.startsWith('@')) {
    handle = handle.substr(1);
  }

  T.get('users/lookup',
      {screen_name: `${handle}`, result_type: 'recent',
        count: 3}, async function(err, data, response) {
        await Promise.allSettled(bots.map(async (bot) => {
          data.forEach( (userData) => {
            const tweetData = userData.status;

            return new Promise(async function(resolve, reject) {
              try {
                const ret = await like(bot, tweetData.id_str);
                return resolve(ret);
              } catch (e) {
                return reject(new Error(e));
              }
            });
          });
        })).then((values) => {
          return callback(200, values);
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

    bot.apiKey = encrypt.decryptMessage(bot.apikey);
    bot.apiSecretKey = encrypt.decryptMessage(bot.apisecretkey);
    bot.accessToken = encrypt.decryptMessage(bot.accesstoken);
    bot.accessSecretToken = encrypt.decryptMessage(bot.accesssecrettoken);
    // console.log(bot);
    return bot;
  }));

  const bot = bots[0];

  const T = new Twit({
    consumer_key: bot.apiKey,
    consumer_secret: bot.apiSecretKey,
    access_token: bot.accessToken,
    access_token_secret: bot.accessSecretToken,
  });

  if (handle.startsWith('@')) {
    handle = handle.substr(1);
  }

  T.get('users/lookup',
      {screen_name: `${handle}`, result_type: 'recent',
        count: 3}, async function(err, data, response) {
        // console.log(data);

        await Promise.allSettled(bots.map(async (bot) => {
          // console.log(data);

          data.forEach( (userData) => {
            const tweetData = userData.status;

            return new Promise(async function(resolve, reject) {
              try {
                const ret = await retweet(bot, tweetData.id_str);
                return resolve(ret);
              } catch (e) {
                console.log(e);
                return reject(new Error(e));
              }
            });
          });
        })).then((values) => {
          // console.log(values);
          return callback(200, values);
        });
      });
}

// eslint-disable-next-line require-jsdoc
async function executeFollowOrder(tweetOrder, callback) {
  const handle = tweetOrder.handle;
  let bots = tweetOrder.botIds;

  bots = await Promise.all(bots.map(async (bot) => {
    bot = await Bot.selectWhereId(bot);
    bot = bot.res;

    bot.apiKey = encrypt.decryptMessage(bot.apikey);
    bot.apiSecretKey = encrypt.decryptMessage(bot.apisecretkey);
    bot.accessToken = encrypt.decryptMessage(bot.accesstoken);
    bot.accessSecretToken = encrypt.decryptMessage(bot.accesssecrettoken);
    // console.log(bot);
    return bot;
  }));

  await Promise.allSettled(bots.map(async (bot) => {
    return new Promise(async function(resolve, reject) {
      try {
        const ret = await follow(bot, handle);
        return resolve(ret);
      } catch (e) {
        return reject(new Error(e));
      }
    });
  })).then((values) => {
    return callback(200, values);
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
