const router = require('express').Router();
const Joi = require('@hapi/joi');
const validate = require('../middlewares/validate');
const SlackController = require('../controllers/slack');
const wrapAsyncError = require('../middlewares/wrapAsyncError');
const checkAuth = require('../middlewares/checkAuth');

router.use(checkAuth());

router.get('/channel_list', wrapAsyncError(SlackController.getChannelList));

router.post(
  '/test_message',
  validate.body(
    Joi.object({
      channelId: Joi.string().required(),
    }),
  ),
  wrapAsyncError(SlackController.postMessage),
);

module.exports = router;
