import { In, Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Problem } from '../entities/Problem';

export class ProblemRepository {
  private readonly repo: Repository<Problem>;

  constructor() {
    this.repo = AppDataSource.getRepository(Problem);
  }

  findById(problemId: string): Promise<Problem | null> {
    return this.repo.findOne({ where: { id: problemId } });
  }

  findByTopicIds(topicIds: string[]): Promise<Problem[]> {
    return this.repo.find({
      where: { topicId: In(topicIds) },
      order: { orderIndex: 'ASC' },
    })
  }
}
