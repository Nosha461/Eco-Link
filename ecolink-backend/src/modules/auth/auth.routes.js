import express from 'express';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as authController from './auth.controller.js';
import { validateRegister, validateLogin, validateRefreshToken } from './auth.validation.js';
import { forgotPassword } from './auth.controller.js';
import { verifyCode } from './auth.controller.js';
import { resetPassword } from './auth.controller.js';

const router = express.Router();

router.post('/register', validateRequest(validateRegister), authController.register);
router.post('/login', validateRequest(validateLogin), authController.login);
router.post('/refresh-token', validateRequest(validateRefreshToken), authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

export default router;
//E:\ECO LINK\ecolink-backend\src\modules\auth\auth.routes.js