import { asyncHandler } from '../../utils/error/index.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if(!firstName || !lastName || !email || !password){
    return res.status(400).json({ success:false, message:"All fields are required" });
  }
  const result = await authService.register(firstName, lastName, email, password);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({ success: true, data: result });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body?.refreshToken || req.headers?.refreshtoken;
  const result = await authService.refreshTokens(refreshToken);
  res.status(200).json({ success: true, data: result });
});

export const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body?.refreshToken || req.headers?.refreshtoken;
  await authService.logout(refreshToken);
  res.status(200).json({ success: true, message: 'Logged out successfully' });


});
// forgot password (send code)
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  await authService.forgotPassword(email);

  res.status(200).json({
    success: true,
    message: "Verification code sent"
  });
});
// verify code
export const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: "Email and code are required" });
  }

  await authService.verifyCode(email, code);

  res.status(200).json({
    success: true,
    message: "Code verified successfully"
  });
});
// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  await authService.resetPassword(email, password);

  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});

//E:\ECO LINK\ecolink-backend\src\modules\auth\auth.controller.js