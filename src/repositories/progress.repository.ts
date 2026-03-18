import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { UserProgress } from '../entities/UserProgress';

export class ProgressRepository {
  private readonly repo: Repository<UserProgress>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserProgress);
  }

  findByUser(userId: string): Promise<UserProgress[]> {
    return this.repo.find({
      where: { userId },
      relations: { problem: { topic: true } },
      order: { updatedAt: 'DESC' },
    });
  }

  async upsertProgress(userId: string, problemId: string, completed: boolean): Promise<UserProgress> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(UserProgress)
      .values({ userId, problemId, completed })
      .orUpdate(['completed', 'updatedAt'], ['userId', 'problemId'])
      .execute();

    const result = await this.repo.findOne({ where: { userId, problemId } });
    if (!result) {
      throw new Error('Failed to upsert user progress');
    }
    return result;
  }
}
