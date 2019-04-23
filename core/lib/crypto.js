"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Reference: http://lollyrock.com/articles/nodejs-encryption
const algorithm = 'aes-256-ctr';

function encrypt(text, secret) {
  if (!secret) {
    throw new Error('Missing crypto secret');
  }

  const cipher = _crypto.default.createCipher(algorithm, secret);

  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text, secret) {
  if (!secret) {
    throw new Error('Missing crypto secret');
  }

  const decipher = _crypto.default.createDecipher(algorithm, secret);

  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}