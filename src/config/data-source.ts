import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Topic } from '../entities/Topic';
import { Problem } from '../entities/Problem';
import { UserProgress } from '../entities/UserProgress';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Topic, Problem, UserProgress],
  migrations: [],
  subscribers: [],
  extra: {
    max: 30,
  },
  ssl: {
    rejectUnauthorized: false,
  }
});
