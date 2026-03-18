import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Topic } from '../entities/Topic';
import { Problem } from '../entities/Problem';
import { UserProgress } from '../entities/UserProgress';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.dbUrl,
  synchronize: false,
  logging: env.nodeEnv === 'development',
  entities: [User, Topic, Problem, UserProgress],
  migrations: [],
  subscribers: [],
  extra: {
    max: 30,
  },
});
