import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import AES from 'crypto-js/aes.js';
import Utf8 from 'crypto-js/enc-utf8.js';

const HashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

function encrypt(text, key) {
  const encrypted= AES.encrypt(text, key).toString()
  return encrypted;
}

// Function to decrypt text
function decrypt(encryptedText, key) {
  const bytes = AES.decrypt(encryptedText, key);
  const originalText = bytes.toString(Utf8);
  return originalText;
}

const ComparePassword = (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

const GenerateOrderId = () => {
  const orderId = nanoid();
  return orderId;
};

const GenerateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1800s' });
};

export default {
  HashPassword,
  ComparePassword,
  GenerateAccessToken,
  GenerateOrderId,
  encrypt,decrypt
};
