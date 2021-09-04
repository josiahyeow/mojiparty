const crypto = require("crypto");

const ALGORITHM = "aes-256-ctr";
const SECRET_KEY = process.env.SECRET_KEY;
const IV = crypto.randomBytes(16);

const encryptJSON = (json) => {
  const text = JSON.stringify(json);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: IV.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decryptJSON = (hash) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(hash.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString());
};

module.exports = { decryptJSON };
