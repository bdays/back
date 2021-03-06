const rs = require('jsrsasign');
require('dotenv');
const cryptoRandomString = require('crypto-random-string');
const CryptoJS = require('crypto-js');

const secret = process.env.JWT_SECRET || '';

function getSession(userId, sessionId) {
  const hash = CryptoJS.HmacMD5(userId, sessionId);
  const session = hash.toString(CryptoJS.enc.Hex);
  return session;
}

function getTimeTokenDeath(unixStart) {
  return unixStart + 86400 * 30; // 30 DAYS
}

const sHeader = JSON.stringify({ alg: 'HS512', typ: 'JWT' });

function generateToken(userId, role, sessionId) {
  // Header
  // Payload
  const oPayload = {};
  const tNow = rs.jws.IntDate.get('now');
  const tEnd = getTimeTokenDeath(tNow);
  oPayload.nbf = tNow;
  oPayload.iat = tNow;
  oPayload.exp = tEnd;
  oPayload.data = {
    userId,
    role,
    session: getSession(userId, sessionId),
  };
  const sPayload = JSON.stringify(oPayload);

  return rs.jws.JWS.sign('HS512', sHeader, sPayload, rs.stob64(secret));
}

function verifyToken(token) {
  try {
    const is = rs.jws.JWS.verifyJWT(token, rs.stob64(secret), { alg: ['HS512'] });
    return is;
  } catch (e) {
    return false;
  }
}

function generateSessionId() {
  return cryptoRandomString({ length: 4 });
}

function getPayload(token) {
  return rs.jws.JWS.readSafeJSONString(rs.b64utoutf8(token.split('.')[1]));
}

module.exports = { generateToken, generateSessionId, getSession, getTimeTokenDeath, verifyToken, getPayload };
