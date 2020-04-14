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

  async changePassword(req, res) {
    const { userId } = res.locals.jwt_claims.data;
    const { password, currentPassword } = req.body;

    const { userName, id, role, sessionId } = await AuthService.changePasswordById(userId, currentPassword, password);

    responseSuccess.update(res, {
      userName,
      userId: id,
      role,
      token: jwt.generateToken(id, role, sessionId),
    });
  }

  async createNewUser(req, res) {
    const { userId, role } = res.locals.userInfo;

    if (role !== 1) throw new CustomError().notEnoughRights();

    const record = await AuthService.createNewUser(userId, req.body.userName, req.body.role);

    responseSuccess.created(res, {
      id: record.id,
      userName: record.userName,
      role: record.role,
      password: record.password,
    });
  }
}

module.exports = new Auth();
