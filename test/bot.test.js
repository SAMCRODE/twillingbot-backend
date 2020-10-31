const Bot = require('../models/bot');
const FollowOrder = require('../models/FollowOrder');
const TweetOrder = require('../models/TweetOrder');
const botService = require('../services/bot');

test('saveBot', async () => {
  const botTest = new Bot(0, 'bot', '@bot', 'www.image.com', 123, 'asdfa',
      'aasdfasd', 'asdfasdf', 'asdfasdf');

  try {
    const a = await Bot.save(botTest);

    await Bot.delete(a.res.id);
  } catch (e) {
    expect(e).toBe(null);
  }
});

test('selectBotList', (done) => {
  botService.getBotList(function(code, msg) {
    expect(code).toBe(200);

    done();
  });
});

// test('executeTweetOrder', (done) => {
//   botService.executeTweetOrder(new TweetOrder([8],
//       'ola @just_a_foolish'), function(code, msg) {
//     expect(code).toBe(200);
//     done();
//   });
// });

test('executeFollowOrder', (done) => {
  botService.executeFollowOrder(new FollowOrder([45],
      'MordekaiWoodi'), function(code, msg) {
    expect(code).toBe(200);
    done();
  });
});

test('executeLikeOrder', (done) => {
  botService.executeLikeOrder(new FollowOrder([44],
      '@just_a_foolish'), function(code, msg) {
    expect(code).toBe(200);
    done();
  });
});

test('executeRetweetOrder', (done) => {
  botService.executeRetweetOrder(new FollowOrder([44],
      'just_a_foolish'), function(code, msg) {
    expect(code).toBe(200);
    done();
  });
});
