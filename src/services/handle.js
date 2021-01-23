const Twit = require('twit');
const config = require('../config/twitter');

/**
 *
 * @param {string} handle
 * @param {function} callback
 */
function searchHandle(handle, callback) {
  const T = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessTokenSecret,
  });
  handle = handle.split('@').join('');

  T.get('users/lookup', {screen_name: `${handle}`, result_type: 'recent'},
      function(err, data, response) {
        if (err) {
          return callback(err.statusCode === 404 ? 401 : err.statusCode,
              {code: err.statusCode === 404 ? 'NOTFOUNDHANDLE' :
      'SERVEROFF', msg: 'some error ocurred'});
        }
        console.log(data[0]);
        return callback(200, {
          id_str: data[0].id_str,
          handle: handle,
          name: data[0].name,
          description: data[0].description,
          followers_count: data[0].followers_count,
          profile_image_url: data[0].profile_image_url,
          status: data[0].status ?
          {id_str: data[0].status.id_str, text:
            data[0].status.text} : undefined});
      });
}

module.exports = {
  searchHandle: searchHandle,
};
