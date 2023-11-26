import User from '../models/user.model.js';
import apiRespon from '../utils/apiRespon.js';
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

    res.status(201).json(apiRespon.StatusCreated('Succes Created User'));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userLogin = await User.findOne({ where: { email: email } });
    if (!userLogin) {
      return res.status(404).json(apiRespon.StatusNotFound('Login failed, please check your email or password', "Can't find user"));
    }

    const isValidPassword = await utils.ComparePassword(password, userLogin.password);

    if (!isValidPassword) {
      return res.status(400).json(apiRespon.StatusCostumRespon('Login failed, please check your email or password', 400, 'Bad Request'));
    }

    const token = utils.GenerateAccessToken({ id: userLogin.id, email: userLogin.email });

    res.cookie('tokens', token, { maxAge: 900000, httpOnly: true });

    res.json(apiRespon.StatusNoContent('Login Succes'));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const ForgetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const userCheck = await User.findOne({ where: { email: email } });
    if (!userCheck) {
      return res.status(404).json(apiRespon.StatusNotFound('user not exited', "can't found user by email address"));
    }
    const hashPassword = await utils.HashPassword(newPassword);

    await User.update({ password: hashPassword }, { where: { id: userCheck.id } });

    res.status(204).json(apiRespon.StatusNoContent('Succes Update Password'));
  } catch (error) {
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  Register,
  Login,
  ForgetPassword,
};
