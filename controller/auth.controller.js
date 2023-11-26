import User from '../models/user.model.js';
import utils from '../utils/utils.js';

const Register = async (req, res, next) => {
  const { firstName, lastName, email, gender, password } = req.body;

  try {
    const exitedEmail = await User.findOne({ where: { email: email } });
    if (exitedEmail) {
      return res.status(422).json({
        code: 422,
        status: 'Unprocessable Entity',
        errorMsg: 'User exits alredy, please login instead',
      });
    }

    let hashPassword = await utils.HashPassword(password);

    await User.create({
      firstName,
      lastName,
      email,
      gender,
      password: hashPassword,
    });

    res.status(201).json({
      code: 201,
      status: 'created',
      message: 'Succes Create User',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      errorMsg: error,
    });
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userLogin = await User.findOne({ where: { email: email } });
    if (!userLogin) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        errorMsg: 'Login failed, please check your email or password',
      });
    }

    const isValidPassword = await utils.ComparePassword(password, userLogin.password);

    if (!isValidPassword) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        errorMsg: 'Login failed, please check your email or password',
      });
    }

    const token = utils.GenerateAccessToken({ id: userLogin.id, email: userLogin.email });

    res.cookie('tokens', token, { maxAge: 900000, httpOnly: true });

    res.json({
      code: 200,
      status: 'OK',
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      errorMsg: error,
    });
  }
};

const ForgetPasswords = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const userCheck = await User.findOne({ where: { email: email } });
    if (!userCheck) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        errorMsg: '',
      });
    }
    const hashPassword = await utils.HashPassword(newPassword);

    await User.update({ password: hashPassword }, { where: { id: userCheck.id } });

    res.status(204).json({
      code: 204,
      status: 'No Content',
      message: 'Succes Update Password',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      errorMsg: error,
    });
  }
};

export default {
  Register,
  Login,
  ForgetPasswords,
};
