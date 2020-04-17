const axios = require('axios');
require('dotenv');
const sql = require('../sql');
const BdayScheduleService = require('../services/schedule');

const slackBotUrl = process.env.SLACK_BOT_URL || '';

async function sendMessage(scheduleId, channel, text, blocks, attachments) {
  try {
    await axios.post(`${slackBotUrl}/system/message`, {
      channel,
      text,
      blocks,
      attachments,
    });

    BdayScheduleService.setCongratulate(scheduleId);
  } catch (e) {
    console.error('ERROR Send message in slack bot! scheduleId - ', scheduleId);
  }
}

function checkTimeAndSendGreeting() {
  const run = async () => {
    const utcHours = new Date().getHours() + new Date().getTimezoneOffset() / 60;

    const isCurrentHourMoreTen = (utcHours < 0 ? 24 + utcHours : utcHours) >= 10;

    if (isCurrentHourMoreTen) {
      const records = await BdayScheduleService.getScheduleTemplates();

      records.forEach(async ({ id, targetChannelId, text, blocks, attachments }) => {
        if (text && blocks && targetChannelId) {
          sendMessage(id, targetChannelId, text, blocks, attachments);
        }
      });
    }
  };
  run();

  setInterval(run, 60 * 1000); /* 1 MINUTE */
}

function checkBday() {
  sql.procedure.checkBdays();
  setInterval(() => {
    sql.procedure.checkBdays();
  }, 1000 * 60 * 15 /* 15 MINUTES */);
}

function startAll() {
  // eslint-disable-next-line no-new
  new Promise(() => {
    checkBday();
    checkTimeAndSendGreeting();
  });
}

module.exports = { startAll };
