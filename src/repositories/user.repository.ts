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

  async incrementRefreshTokenVersion(userId: string): Promise<number> {
    await this.repo.increment({ id: userId }, 'refreshTokenVersion', 1);
    const updatedUser = await this.findById(userId);

    return updatedUser?.refreshTokenVersion ?? 0;
  }
}
