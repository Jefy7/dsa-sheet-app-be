import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants';
import { verifyJwt } from '../utils/jwt';

export const authGuard = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Missing authentication token',
    });
    return;
  }

  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
