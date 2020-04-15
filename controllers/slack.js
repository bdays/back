const axios = require('axios');
require('dotenv');
const responseSuccess = require('../util/responseSuccess');
const CustomError = require('../util/customError');
const asyncWrapper = require('../util/asyncWrapper');

const slackBotUrl = process.env.SLACK_BOT_URL || '';

class Slack {
  async getChannelList(req, res) {
    const list = await asyncWrapper(axios.get(`${slackBotUrl}/system/channels`), new CustomError().query());

    if (!Array.isArray(list.data)) throw new CustomError().query();

    responseSuccess.query(res, list.data);
  }

  async postMessage(req, res) {
    const { userName } = res.locals.userInfo;
    const { channelId } = req.body;

    return axios
      .post(`${slackBotUrl}/system/message`, {
        channel: channelId,
        text: 'Тестовое сообщение',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Это тестовое сообщение от пользователя - *${userName}*`,
            },
          },
        ],
      })
      .then((resp) => responseSuccess.postMessage(res, resp.data || null))
      .catch((e) => {
        throw new CustomError().postMessage((e && e.response && e.response.data) || e);
      });
  }
}

module.exports = new Slack();
