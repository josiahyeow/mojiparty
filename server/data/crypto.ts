import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-ctr";
const SECRET_KEY = process.env.SECRET_KEY!;
const IV = randomBytes(16);

const encryptJSON = (json: JSON) => {
  const text = JSON.stringify(json);
  const cipher = createCipheriv(ALGORITHM, SECRET_KEY, IV);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: IV.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decryptJSON = (hash: { iv: string; content: string }) => {
  const decipher = createDecipheriv(
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

export { decryptJSON };
