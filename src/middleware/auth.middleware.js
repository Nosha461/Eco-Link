import { Auth } from '../DB/models/auth.model.js';
import { User } from '../DB/models/user.model.js';
import { verifyToken } from '../utils/token/index.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token is required.', { cause: 401 });
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyToken(token); // throws if invalid/expired


    const userExist = await User.findById(payload.id);
    if (!userExist) {
      throw new Error('User is not found', { cause: 404 });
    }

    
    if (
      userExist.credentialsUpdatedAt &&
      payload.iat &&
      new Date(userExist.credentialsUpdatedAt).getTime() / 1000 > payload.iat
    ) {
      throw new Error('Token expired, please login again', { cause: 401 });
    }

    req.user = userExist;

    return next();
  } catch (error) {
    next(error);
  }
};
