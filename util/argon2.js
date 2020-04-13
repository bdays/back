const argon2 = require('argon2');
const cryptoRandomString = require('crypto-random-string');
const asyncWrapper = require('../util/asyncWrapper');
const CustomError = require('../util/customError');

const options = {
  type: argon2.argon2i,
  memoryCost: 12288,
  hashLength: 512,
};

async function hash(password, salt) {
  const hashString = await asyncWrapper(
    argon2.hash(password, { ...options, secret: Buffer.from(salt) }),
    new CustomError().incorrectUserNameOrPassword(),
  );
  return hashString;
}

async function verify(hashString, password, salt) {
  const isValid = await asyncWrapper(
    argon2.verify(hashString, password, { ...options, secret: Buffer.from(salt) }),
    new CustomError().incorrectUserNameOrPassword(),
  );
  return isValid;
}

function generateSecret() {
  return cryptoRandomString({ length: 128 });
}

module.exports = { hash, verify, generateSecret };
