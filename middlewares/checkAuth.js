const responseError = require('../util/responseError');
const jwt = require('../util/jwt');

function unauthorized(res) {
  const response = responseError.unauthorized();
  res.status(response.status).json(response.body);
}

function checkAuth() {
  return (req, res, next) => {
    const headerValue = req.header('Authorization');
    const splitHeaderValue = headerValue && headerValue.length ? headerValue.split(' ') : [];

    if (
      headerValue &&
      splitHeaderValue.length === 2 &&
      splitHeaderValue[0] === 'Bearer' &&
      jwt.verifyToken(splitHeaderValue[1])
    ) {
      res.locals.jwt_claims = jwt.getPayload(splitHeaderValue[1]);
      next();
    } else {
      unauthorized(res);
    }
  };
}

module.exports = checkAuth;
