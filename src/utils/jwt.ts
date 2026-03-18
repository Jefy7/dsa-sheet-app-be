import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IUserPayload } from '../interfaces/auth.interface';

export const signJwt = (payload: IUserPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyJwt = (token: string): IUserPayload => {
  return jwt.verify(token, env.jwtSecret) as IUserPayload;
};
