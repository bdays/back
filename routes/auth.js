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

const checkUserName = Joi.string()
  .pattern(new RegExp('^[a-zA-Z0-9]{1,256}$'))
  .rule({ message: '"{{#label}}" must be a valid userName ^[a-zA-Z0-9]$  len 1-256' })
  .required();

router.post(
  '/login',
  validate.body(
    Joi.object({
      userName: checkUserName,
      password: checkPassword,
    }),
  ),
  wrapAsyncError(AuthController.login),
);

router.use(checkAuth());

router.get('/info', wrapAsyncError(AuthController.getUserInfo));

router.put(
  '/change_password',
  validate.body(Joi.object({ currentPassword: checkPassword, password: checkPassword })),
  wrapAsyncError(AuthController.changePassword),
);

router.post(
  '/create_new_user',
  validate.body(
    Joi.object({
      userName: checkUserName,
      role: Joi.number()
        .required()
        .strict()
        .$.integer()
        .min(1)
        .max(2),
    }),
  ),
  wrapAsyncError(AuthController.createNewUser),
);

module.exports = router;
