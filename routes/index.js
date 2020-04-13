const router = require('express').Router();
const bdays = require('./bdays');
const templates = require('./templates');
const auth = require('./auth');

router.use('/bdays', bdays);
router.use('/templates', templates);
router.use('/auth', auth);

module.exports = router;
