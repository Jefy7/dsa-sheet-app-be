import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_MAX_AGE_MS,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_MS,
} from '../constants/auth.constants';
import { AuthService } from '../services/auth.service';
import { verifyAccessToken } from '../utils/jwt';

const authService = new AuthService();

export const authGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies[AUTH_COOKIE_NAME];
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Missing authentication token',
    });
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    if (refreshToken) {
      try {
        const refreshed = await authService.refresh(refreshToken);
        const secureCookie = process.env.NODE_ENV === 'production';
        const sameSite = secureCookie ? 'none' : 'lax';

        res.cookie(AUTH_COOKIE_NAME, refreshed.accessToken, {
          httpOnly: true,
          secure: secureCookie,
          sameSite,
          maxAge: ACCESS_TOKEN_MAX_AGE_MS,
        });

        res.cookie(REFRESH_COOKIE_NAME, refreshed.refreshToken, {
          httpOnly: true,
          secure: secureCookie,
          sameSite,
          maxAge: REFRESH_TOKEN_MAX_AGE_MS,
        });

        req.user = {
          userId: refreshed.user.id,
          email: refreshed.user.email,
        };

        next();
        return;
      } catch {
        // fall through to unauthorized response
      }
    }

    const isExpiredToken = error instanceof jwt.TokenExpiredError;

    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: isExpiredToken ? 'Access token expired, refresh failed' : 'Invalid authentication token',
    });
  }
};
