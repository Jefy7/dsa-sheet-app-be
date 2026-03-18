import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['DB_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  dbUrl: process.env.DB_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
};
