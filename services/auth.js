const models = require('../models');
const asyncWrapper = require('../util/asyncWrapper');
const CustomError = require('../util/customError');

const AuthModel = models.Auth;

async function getUserInfo(userName) {
  const result = await asyncWrapper(AuthModel.findOne({ where: { userName } }), new CustomError().query());

  return result.dataValues;
}

module.exports = {
  getUserInfo,
};
