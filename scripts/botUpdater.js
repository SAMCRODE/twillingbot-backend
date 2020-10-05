/* eslint-disable max-len */
require('dotenv').config();
const csv = require('csv-parser');
const fs = require('fs');
const Bot = require('../models/bot');
const botService = require('../services/bot');

const update = async () => {
  try {
    await Bot.deleteAll();

    fs.createReadStream('scripts/bots.csv')
        .pipe(csv())
        .on('data', async (row) => {
          const bot = new Bot(0, '', row['Handle'], '', 0, row['Api Key'],
              row['API Secret Key'], row['Access Token'], row['Access Secret Token']);

          await botService.register(bot);
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
        });
  } catch (e) {
    console.log(e);
  }
};

update();


