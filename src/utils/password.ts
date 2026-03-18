import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants';

export const hashPassword = (rawPassword: string): Promise<string> => {
  return bcrypt.hash(rawPassword, BCRYPT_SALT_ROUNDS);
};

export const comparePassword = (rawPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(rawPassword, hashedPassword);
};
