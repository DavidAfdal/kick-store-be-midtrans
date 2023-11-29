import jwt from 'jsonwebtoken';

const CheckAuthorization = (req, res, next) => {
  try {
    const token = req.cookies.tokens;
    if (!token) {
      throw new Error('Authenfication failed');
    }
    const decodeToken = jwt.decode(token, process.env.JWT_SECRET);
    req.user = {
      userId: decodeToken.id,
      email: decodeToken.email,
    };
    next();
  } catch (error) {
    return next(error);
  }
};

const CheckPasswordValidation = (req, res, next) => {
  try {
    const token = req.cookies.emailValid;
    if (!token) {
      throw new Error('Authenfication failed');
    }
    req.check = {
      userId: token,
    };
    next();
  } catch (error) {
    return next(error);
  }
};
export default {
  CheckAuthorization,
  CheckPasswordValidation,
};
