import express from 'express';
import authController from '../controller/auth.controller.js';
import middleware from '../middleware/middleware.js';

const routes = express.Router();

routes.post('/login', authController.Login);
routes.post('/register', authController.Register);
routes.post('/validasi', authController.ValidateEmail);
routes.post('/forgetPassword', middleware.CheckPasswordValidation, authController.ForgetPassword);

export default routes;
