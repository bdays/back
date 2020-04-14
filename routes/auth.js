const router = require('express').Router();
const Joi = require('@hapi/joi');
const validate = require('../middlewares/validate');
const AuthController = require('../controllers/auth');
const wrapAsyncError = require('../middlewares/wrapAsyncError');
const checkAuth = require('../middlewares/checkAuth');

const checkPassword = Joi.string()
  .min(8)
  .max(512)
  .rule({
    message: '"{{#label}}" must be a valid password len 8-512',
  })
  .required();

const body = Joi.object({
  userName: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{1,256}$'))
    .rule({ message: '"{{#label}}" must be a valid userName ^[a-zA-Z0-9]$  len 1-256' })
    .required(),
  password: checkPassword,
});

router.post('/login', validate.body(body), wrapAsyncError(AuthController.login));

router.use(checkAuth());

router.get('/info', wrapAsyncError(AuthController.getUserInfo));

router.put(
  '/change_password',
  validate.body(Joi.object({ currentPassword: checkPassword, password: checkPassword })),
  wrapAsyncError(AuthController.changePassword),
);

module.exports = router;
