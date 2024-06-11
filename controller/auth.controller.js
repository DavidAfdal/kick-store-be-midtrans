import User from '../models/user.model.js';
import apiRespon from '../utils/apiRespon.js';
import utils from '../utils/utils.js';
import  {
  OAuth2Client,
} from "google-auth-library"
import axios from 'axios';
import HttpError from '../utils/httpError.js';
import { SendEmail, TemplateForActiveEmail, TemplateForResetEmail } from '../utils/send_email.js';


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
      return res.status(422).json(apiRespon.StatusCostumRespon("User exits alredy, please login instead",422,"Unprocessable Entity", "Unprocessable Entity"));
    }

    let hashPassword = await utils.HashPassword(password);

   const data =  await User.create({
      name: firstName + " " + lastName,
      email,
      gender,
      password: hashPassword,
    });

    let hashId = utils.encrypt(data.id.toString(), "secret");

    const message = TemplateForActiveEmail(hashId, data.gender, data.name)

    SendEmail(data.email, "Activate Account", message)


    res.status(201).json(apiRespon.StatusCreated('Please check your email for activate account'));
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
      return res.status(404).json(apiRespon.StatusNotFound('This email doesn\`t exit', "Can't find user"));
    }

    if(userLogin.googleLogin === true) {
      next(new HttpError("This account login by google", 400))
      return;
    }

    if(userLogin.isActive === false) {
      next(new HttpError("This account is not actived, activate first", 400))
      return;
    }

    const isValidPassword = await utils.ComparePassword(password, userLogin.password);

    if (!isValidPassword) {
      return res.status(400).json(apiRespon.StatusCostumRespon('Please check your email or password', 400, 'Bad Request'));
    }

    const token = utils.GenerateAccessToken({ id: userLogin.id, email: userLogin.email });

    
    res.json(apiRespon.StatusGetData("sucees", token));
  } catch (error) {
    console.log(error);
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
        isActive: true,
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
  const { email } = req.body;
  try {
    const emailExited =  await User.findOne({where: {email: email}})
    if(!emailExited) {
      next(new HttpError("Email not exited", 404));
      return;
    }

    if(emailExited.googleLogin === true) {
      next(new HttpError("Can't reset password, this account login by google", 400))
      return;
    }

    let hashId =  utils.encrypt(emailExited.id.toString(),"secret");

    const message = TemplateForResetEmail(hashId);

    SendEmail(emailExited.email, "Email for reset password", message);
    res.status(200).json(apiRespon.StatusNoContent('Succes Update Password'));
  } catch (error) {
    console.log(error)
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const ResetPassword = async (req,res,next) => {
  const {password} = req.body;
  const id = utils.decrypt(req.params.id,"secret") 
  try {
    let hashPassword = await utils.HashPassword(password);
    await User.update({password: hashPassword}, {where : {id} });
    res.redirect('http://localhost:5173/login')
  } catch (error) {
    res.redirect(`/forget-password/1?msg="error"`);
  }
}

const JoinMember = async (req, res, next) => {
  const {email} = req.body;
  try {
    const exitedEmail = await User.findOne({where: { email: email}});
    if(!exitedEmail) {
      next(new HttpError("Email not exited", 404))
      return ;
    }
    if(exitedEmail.status === 'Kicks Member' ) {
      next(new HttpError("You are already member", 400))
      return;
    }
    await User.update({status: 'Kicks Member'}, {where: {id: exitedEmail.id}});
    res.status(200).json(apiRespon.StatusCostumRespon("Succes join member kicks store", 200, "Ok"));
  } catch (error) {
    res.status(500).json(apiRespon.StatusIntervalServerError(e.toString()));
  }
}

const SendActivatedAccount =  async (req,res,next) => {
  const {email} = req.body;
  try {
    const exitedEmail = await User.findOne({where: { email: email}});
    console.log(exitedEmail)
    if(!exitedEmail) {
      next(new HttpError("Email not exited", 404))
      return ;
    }

    if(exitedEmail.isActive === true) {
      next(new HttpError("Your Email is already activated", 400))
      return ;
    }

    let hashId =  utils.encrypt(exitedEmail.id.toString(),"secret");

    const message = TemplateForActiveEmail(hashId, exitedEmail.gender, exitedEmail.name)

    SendEmail(exitedEmail.email, "Activate Account", message)

    res.status(200).json(apiRespon.StatusNoContent("Succes send email activate"));

  } catch (error) {
    res.status(500).json(apiRespon.StatusIntervalServerError(error.toString()));
  }
}

const ActivateAccount = async (req, res) => {
  const id = utils.decrypt(req.params.id,"secret") 
  try {
    await User.update({isActive: true}, {where: {id: id}});
    res.status(301).redirect("http://localhost:5173/login")
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error.toString()));
  }
}

export default {
  LoginWithGoogle,
  Register,
  Login,
  ForgetPassword,
  GetProfiles,
  ResetPassword,
  JoinMember,
  SendActivatedAccount,
  ActivateAccount
};
