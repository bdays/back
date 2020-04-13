const rs = require('jsrsasign');
const cryptoRandomString = require('crypto-random-string');

const secret = cryptoRandomString({ length: 1024 });

function generateToken(userId) {
  // Header
  const sHeader = JSON.stringify({ alg: 'HS512', typ: 'JWT' });
  // Payload
  const oPayload = {};
  const tNow = rs.jws.IntDate.get('now');
  const tEnd = rs.jws.IntDate.get('now + 1day');
  oPayload.nbf = tNow;
  oPayload.iat = tNow;
  oPayload.exp = tEnd;
  oPayload.jti = `${userId}`;
  const sPayload = JSON.stringify(oPayload);

  return rs.jws.JWS.sign('HS512', sHeader, sPayload, rs.stob64(secret));
}

module.exports = { generateToken };
