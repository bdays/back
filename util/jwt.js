const rs = require('jsrsasign');
const cryptoRandomString = require('crypto-random-string');
const CryptoJS = require('crypto-js');

const secret = cryptoRandomString({ length: 1024 });

function getSession(userId, role, sessionId) {
  const hash = CryptoJS.HmacMD5(`${userId}+${role}`, sessionId);
  const session = hash.toString(CryptoJS.enc.Hex);
  return session;
}

function getTimeTokenDeath(unixStart) {
  return unixStart + 86400; // 1 DAY
}

function generateToken(userId, role, sessionId) {
  // Header
  const sHeader = JSON.stringify({ alg: 'HS512', typ: 'JWT' });
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
    session: getSession(userId, role, sessionId),
  };
  const sPayload = JSON.stringify(oPayload);

  return rs.jws.JWS.sign('HS512', sHeader, sPayload, rs.stob64(secret));
}

function generateSessionId() {
  return cryptoRandomString({ length: 4 });
}

module.exports = { generateToken, generateSessionId, getSession, getTimeTokenDeath };
