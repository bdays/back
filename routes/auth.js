const router = require('express').Router();
const Joi = require('@hapi/joi');
const validate = require('../middlewares/validate');
const AuthController = require('../controllers/auth');
const wrapAsyncError = require('../middlewares/wrapAsyncError');

const body = Joi.object({
  userName: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{1,256}$'))
    .rule({ message: '"{{#label}}" must be a valid userName ^[a-zA-Z0-9]$  len 1-256' })
    .required(),
  password: Joi.string()
    .min(8)
    .max(512)
    .rule({
      message: '"{{#label}}" must be a valid password len 8-512',
    })
    .required(),
});

router.post('/login', validate.body(body), wrapAsyncError(AuthController.login));

module.exports = router;
