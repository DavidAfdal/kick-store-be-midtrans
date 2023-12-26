import User from '../models/user.model.js';
import apiRespon from '../utils/apiRespon.js';
import utils from '../utils/utils.js';
import  {
  OAuth2Client,
} from "google-auth-library"
import axios from 'axios';

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

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
      name: firstName + " " + lastName,
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

    
    res.json(apiRespon.StatusGetData("sucees", token));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const ValidateEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const userCheck = await User.findOne({ where: { email: email } });
    if (!userCheck) {
      return res.status(404).json(apiRespon.StatusNotFound('user not exited', "can't found user by email address"));
    }
    res.cookie('emailValid', userCheck.id, { maxAge: 900000, httpOnly: true });
    return res.status(200).json({ message: 'succes' });
  } catch (error) {
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const LoginWithGoogle = async (req, res, next) => {
  const {code} = req.body;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens)
    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      }
    );
   
   const userData = userResponse.data
    const exitedUser = await User.findOne({where : {email: userData.email}})

    if(exitedUser) {
      const token = utils.GenerateAccessToken({ id: exitedUser.id, email: exitedUser.email });
      return res.json(apiRespon.StatusGetData("sucees", token));
    } else {
      const response = await User.create({
        name: userResponse.data.name,
        email: userResponse.data.email,
        googleLogin: true,
      })
      const token = utils.GenerateAccessToken({ id: response.id, email: response.email });
      return res.json(apiRespon.StatusGetData("sucees", token));
    }
  } catch (error) {
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
}

const GetProfiles = async (req, res,next) => {
  const { userId } = req.user;

  try {
    const response = await User.findOne({where: {id: userId}})
  
    return res.status(200).json(apiRespon.StatusGetData('Succes', response))
  } catch (error) {
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
}

const ForgetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { userId } = req.check;
  try {
    const hashPassword = await utils.HashPassword(password);

    await User.update({ password: hashPassword }, { where: { id: userId } });

    res.clearCookie('emailValid');

    res.status(200).json(apiRespon.StatusNoContent('Succes Update Password'));
  } catch (error) {
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  LoginWithGoogle,
  Register,
  Login,
  ForgetPassword,
  ValidateEmail,
  GetProfiles,
};
