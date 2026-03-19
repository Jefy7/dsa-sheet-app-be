import jwt from 'jsonwebtoken';
import { IUserPayload } from '../interfaces/auth.interface';

export const signJwt = (payload: IUserPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyJwt = (token: string): IUserPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as IUserPayload;
};
