import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

export class UserRepository {
  private readonly repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(user: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(user));
  }
}
