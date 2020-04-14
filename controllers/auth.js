const responseSuccess = require('../util/responseSuccess');
const jwt = require('../util/jwt');
const argon2 = require('../util/argon2');
const AuthService = require('../services/auth');
const CustomError = require('../util/customError');
const asyncWrapper = require('../util/asyncWrapper');

class Auth {
  async login(req, res) {
    const { userName, password } = req.body;

    const userInfo = await asyncWrapper(
      AuthService.getUserInfo(userName),
      new CustomError().incorrectUserNameOrPassword(),
    );

    const isPasswordValid = await argon2.verify(userInfo.passwordHash, password, userInfo.salt);

    if (!isPasswordValid) throw new CustomError().incorrectUserNameOrPassword();

    responseSuccess.query(res, {
      userName,
      userId: userInfo.id,
      role: userInfo.role,
      token: jwt.generateToken(userInfo.id, userInfo.role, userInfo.sessionId),
    });
  }

  async getUserInfo(req, res) {
    const { userId } = res.locals.jwt_claims.data;

    const userInfo = await asyncWrapper(AuthService.getUserInfoById(userId), new CustomError().query());

    responseSuccess.query(res, {
      userName: userInfo.userName,
      userId: userInfo.id,
      role: userInfo.role,
    });
  }
}

module.exports = new Auth();
