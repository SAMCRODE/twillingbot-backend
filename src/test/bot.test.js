const Bot = require('../models/bot');
const botService = require('../services/bot');
const FollowOrder = require('../models/FollowOrder');

test('saveBot', async (done) => {
  const botTest = new Bot(0, 'bot', '@bot', 'www.image.com', 123, 'asdfa',
      'aasdfasd', 'asdfasdf', 'asdfasdf');

  try {
    const a = await Bot.save(botTest);

    await Bot.delete(a.res.id);
  } catch (e) {
    expect(e).toBe(null);
  }
  done();
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

// test('executeFollowOrder', async (done) => {
//   const ids = (await Bot.selectBotList()).res.map((obj) => obj.id);

//   botService.executeFollowOrder(new FollowOrder(ids,
//       'neymarjr'), function(code, msg) {
//     expect(code).toBe(200);
//     done();
//   });
// });

// test('executeLikeOrder', async (done) => {
//   const ids = (await Bot.selectBotList()).res.map((obj) => obj.id);

//   botService.executeLikeOrder(new FollowOrder(ids,
//       '@neymarjr'), function(code, msg) {
//     expect(code).toBe(200);
//     done();
//   });
// });

// test('executeRetweetOrder', async (done) => {
//   const ids = (await Bot.selectBotList()).res.map((obj) => obj.id);

//   botService.executeRetweetOrder(new FollowOrder(ids,
//       'neymarjr'), function(code, msg) {
//     expect(code).toBe(200);
//     done();
//   });
// });
