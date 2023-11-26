import express from 'express';
import authController from '../controller/auth.controller.js';

const routes = express.Router();

routes.post('/login', authController.Login);
routes.post('/register', authController.Register);
routes.post('/forgetPassword', authController.ForgetPasswords);

export default routes;
