import express from 'express';
import authController from '../controller/auth.controller.js';
import middleware from '../middleware/middleware.js';

const routes = express.Router();

routes.get('/profile', middleware.CheckAuthorization, authController.GetProfiles)
routes.post('/login', authController.Login);
routes.post('/register', authController.Register);
routes.post('/loginGoogle', authController.LoginWithGoogle);
routes.post('/forgetPassword',  authController.ForgetPassword);
routes.post('/joinMember',  authController.JoinMember);
routes.post("/sendActived", authController.SendActivatedAccount);
export default routes;
