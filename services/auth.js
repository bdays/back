const cryptoRandomString = require('crypto-random-string');
const models = require('../models');
const asyncWrapper = require('../util/asyncWrapper');
const CustomError = require('../util/customError');
const argon2 = require('../util/argon2');
const jwt = require('../util/jwt');

const AuthModel = models.Auth;

async function getUserInfo(userName) {
  const result = await asyncWrapper(AuthModel.findOne({ where: { userName } }), new CustomError().query());

  return result.dataValues;
}

async function getUserInfoById(id) {
  const result = await asyncWrapper(AuthModel.findOne({ where: { id } }), new CustomError().query());

  return result.dataValues;
}

async function changePasswordById(id, currentPassword, newPassword) {
  const record = await asyncWrapper(AuthModel.findOne({ where: { id } }), new CustomError().query());

  const isValidCurrentPassword = await argon2.verify(record.passwordHash, currentPassword, record.salt);

  if (!isValidCurrentPassword) throw new CustomError().incorrectUserNameOrPassword();

  if (currentPassword === newPassword) throw new CustomError().notModify();

  const salt = argon2.generateSecret();
  const hash = await argon2.hash(newPassword, salt);

  const updatedRecord = await asyncWrapper(
    record.update({
      passwordHash: hash,
      sessionId: jwt.generateSessionId(),
      salt,
    }),
    new CustomError().update(),
  );

  return updatedRecord.dataValues;
}

async function createNewUser(creatorUserId, userName, role) {
  const finded = await asyncWrapper(AuthModel.findOne({ where: { userName } }), new CustomError().query());

  if (finded) throw new CustomError().userAlreadyCreated();

  const password = cryptoRandomString({ length: 16 });
  const salt = argon2.generateSecret();
  const passwordHash = await argon2.hash(password, salt);

  const record = await asyncWrapper(
    AuthModel.create({
      userName,
      role,
      passwordHash,
      salt,
      sessionId: jwt.generateSessionId(),
    }),
    new CustomError().create(),
  );

  return { ...record.dataValues, password };
}

module.exports = {
  getUserInfo,
  getUserInfoById,
  changePasswordById,
  createNewUser,
};
