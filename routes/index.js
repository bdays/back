const router = require('express').Router();
const bdays = require('./bdays');
const templates = require('./templates');
const auth = require('./auth');
const slack = require('./slack');

router.use('/auth', auth);
router.use('/bdays', bdays);
router.use('/templates', templates);
router.use('/slack', slack);

module.exports = router;
