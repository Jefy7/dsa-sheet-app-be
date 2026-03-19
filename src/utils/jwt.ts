import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../constants/auth.constants';
import { IRefreshTokenPayload } from '../interfaces/auth.interface';
import { IUserPayload } from '../interfaces/auth.interface';

export const signAccessToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const signRefreshToken = (payload: IRefreshTokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): IUserPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as IUserPayload;
};

export const verifyRefreshToken = (token: string): IRefreshTokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!) as IRefreshTokenPayload;
};
