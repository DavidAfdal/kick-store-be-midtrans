import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const HashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

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
};
