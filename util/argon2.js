const argon2 = require('argon2');

async function hash(password) {
  return await argon2.hash(password);
}

async function verify(hash, password) {}

module.exports = { hash, verify };
