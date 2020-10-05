const Bot = require('../models/bot');
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
