import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

const HashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

function encrypt(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt text
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
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
