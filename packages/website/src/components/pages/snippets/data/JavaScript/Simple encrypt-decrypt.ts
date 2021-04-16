const { AES, enc } = require("crypto-js");
const { CRYPTO_KEY } = process.env;

function encrypt(str) {
  return AES.encrypt(str, CRYPTO_KEY).toString();
}

function decrypt(str) {
  const bytes = AES.decrypt(str, CRYPTO_KEY);
  return bytes.toString(enc.Utf8);
}