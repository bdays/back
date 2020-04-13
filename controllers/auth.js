const responseSuccess = require('../util/responseSuccess');
const jwt = require('../util/jwt');
const argon2 = require('../util/argon2');

class Auth {
  async login(req, res) {
    const { userName, password } = req.body;
    // const record = await BdaysService.getByIdBasicData(req.params.id);

    // if (!record) throw new CustomError().query('not found');
    try {
      const hash = await argon2.hash(password);

      responseSuccess.query(res, {
        token: jwt.generateToken(hash),
      });
    } catch (err) {
      //...
    }
  }
}

module.exports = new Auth();
