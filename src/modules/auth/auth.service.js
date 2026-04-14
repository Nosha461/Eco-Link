import { User } from '../../DB/models/user.model.js';
import { Auth } from '../../DB/models/auth.model.js';
import { hashPassword, comparePassword } from '../../utils/hash/index.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/token/index.js';

const formatUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});


// ================= REGISTER =================
export const register = async (firstName, lastName, email, password) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error('Email is already registered', { cause: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: passwordHash
  });

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Auth.create({ token: refreshToken, user: user._id, type: 'refresh' });

  return { user: formatUser(user), token, refreshToken };
};


// ================= LOGIN =================
export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('Invalid email or password', { cause: 401 });
  }

  const match = await comparePassword(password, user.password);

  if (!match) {
    throw new Error('Invalid email or password', { cause: 401 });
  }

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Auth.create({ token: refreshToken, user: user._id, type: 'refresh' });

  return { user: formatUser(user), token, refreshToken };
};


// ================= REFRESH TOKEN =================
export const refreshTokens = async (refreshToken) => {
  const payload = verifyToken(refreshToken);

  const tokenDoc = await Auth.findOne({
    token: refreshToken,
    user: payload.id,
    type: 'refresh'
  });

  if (!tokenDoc) {
    throw new Error('Invalid refresh token, please login again', { cause: 401 });
  }

  await Auth.findOneAndDelete({
    token: refreshToken,
    user: payload.id,
    type: 'refresh'
  });

  const token = generateAccessToken(payload.id);
  const newRefreshToken = generateRefreshToken(payload.id);

  await Auth.create({
    token: newRefreshToken,
    user: payload.id,
    type: 'refresh'
  });

  const user = await User.findById(payload.id);
  if (!user) throw new Error('User not found', { cause: 404 });

  return { user: formatUser(user), token, refreshToken: newRefreshToken };
};


// ================= LOGOUT =================
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await Auth.findOneAndDelete({ token: refreshToken, type: 'refresh' });
  }
  return { success: true };
};


// ================= FORGOT PASSWORD =================

// 1- send code
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('User not found', { cause: 404 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  
  const hashedCode = await hashPassword(code);

  user.resetCode = hashedCode;
  user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min
  user.isResetVerified = false;

  await user.save();

  
  console.log("Reset Code:", code);

  return { message: "Verification code sent" };
};


// 2- verify code
export const verifyCode = async (email, code) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('User not found', { cause: 404 });
  }

  if (
    !user.resetCode ||
    user.resetCodeExpires < Date.now()
  ) {
    throw new Error('Code expired', { cause: 400 });
  }

  const isMatch = await comparePassword(code, user.resetCode);

  if (!isMatch) {
    throw new Error('Invalid code', { cause: 400 });
  }

  user.isResetVerified = true;
  await user.save();

  return { message: "Code verified successfully" };
};


// 3- reset password
export const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('User not found', { cause: 404 });
  }

  if (!user.isResetVerified) {
    throw new Error('Code not verified', { cause: 400 });
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  user.credentialsUpdatedAt = Date.now();
  user.resetCode = null;
  user.resetCodeExpires = null;
  user.isResetVerified = false;

  await user.save();

  return { message: "Password reset successful" };
};
//E:\ECO LINK\ecolink-backend\src\modules\auth\auth.service.js