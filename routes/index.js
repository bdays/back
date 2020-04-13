const router = require('express').Router();
const bdays = require('./bdays');
const templates = require('./templates');
const auth = require('./auth');

router.use('/auth', auth);
router.use('/bdays', bdays);
router.use('/templates', templates);

module.exports = router;
