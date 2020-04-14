const responseError = require('../util/responseError');
const jwt = require('../util/jwt');
const AuthService = require('../services/auth');
const CustomError = require('../util/customError');
const asyncWrapper = require('../util/asyncWrapper');

function unauthorized(res) {
  const response = responseError.unauthorized();
  res.status(response.status).json(response.body);
}

function checkAuth() {
  return async (req, res, next) => {
    const headerValue = req.header('Authorization');
    const splitHeaderValue = headerValue && headerValue.length ? headerValue.split(' ') : [];

    if (
      headerValue &&
      splitHeaderValue.length === 2 &&
      splitHeaderValue[0] === 'Bearer' &&
      jwt.verifyToken(splitHeaderValue[1])
    ) {
      try {
        res.locals.jwt_claims = jwt.getPayload(splitHeaderValue[1]);
        const { userId, session: tokenSession } = res.locals.jwt_claims.data;
        const userInfo = await asyncWrapper(AuthService.getUserInfoById(userId), new CustomError().query());
        res.locals.userInfo = userInfo;

        const currentSession = jwt.getSession(userId, userInfo.sessionId);

        if (tokenSession === currentSession) {
          next();
          return;
        }
        unauthorized(res);
      } catch (e) {
        unauthorized(res);
      }
      return;
    }
    unauthorized(res);
  };
}

module.exports = checkAuth;
