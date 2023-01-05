import CognitoExpress from 'cognito-express';
import httpStatus from 'http-status';
import { USER_POOL_ID, REGION } from '../config/config';
import UserModel from '../models/user.model';
import logger from '../config/logger';
import routes from '../config/publicroutes';
import ApiError from '../utils/ApiError';
import { UNAUTHORIZED } from '../utils/errorMessage';
import { UserStatus } from '../config/constants';

/* eslint-disable import/prefer-default-export */
export const validateAuth = async (req, res, next) => {
  /* eslint-disable no-restricted-syntax */
  for (const route of routes) {
    if (req.originalUrl === route.path && req.method === route.method) return next();
  }

  const accessTokenFromClient = req.headers.authorization || req.headers.Authorization;
  if (!accessTokenFromClient) {
    next(new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED));
  }

  const cognitoExpress = new CognitoExpress({
    region: REGION,
    cognitoUserPoolId: USER_POOL_ID,
    tokenUse: 'access',
    tokenExpiration: 3600000, // Up to default expiration of 1 hour (3600000 ms)
  });

  try {
    const tokenRes = await cognitoExpress.validate(accessTokenFromClient);
    logger.info('validateAuth', tokenRes);
    const user = await UserModel.findOne({ email: tokenRes.username }).lean();
    if (!user || user.status === UserStatus.SUSPENDED) return next(new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED));
    logger.info('User found successfully', user);
    req.user = user;
  } catch (err) {
    logger.error('validateToken', err.message);
    return next(new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED));
  }
  return next();
};
