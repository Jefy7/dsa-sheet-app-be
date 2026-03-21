import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Topic } from '../entities/Topic';
import { Problem } from '../entities/Problem';
import { UserProgress } from '../entities/UserProgress';
import path from 'path';
import fs from 'fs'

const certPath = path.resolve(__dirname, '../../certs/global-bundle.pem');
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Topic, Problem, UserProgress],
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(certPath).toString(),
  },
});
