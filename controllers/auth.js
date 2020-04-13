const responseSuccess = require('../util/responseSuccess');
const jwt = require('../util/jwt');

class Auth {
  async login(req, res) {
    // const record = await BdaysService.getByIdBasicData(req.params.id);

    // if (!record) throw new CustomError().query('not found');

    responseSuccess.query(res, {
      token: jwt.generateToken(123),
    });
  }
}

module.exports = new Auth();
