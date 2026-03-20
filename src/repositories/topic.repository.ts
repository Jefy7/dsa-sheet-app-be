import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Topic } from '../entities/Topic';

export class TopicRepository {
  private readonly repo: Repository<Topic>;

  constructor() {
    this.repo = AppDataSource.getRepository(Topic);
  }

  async findPaginated(page: number, limit: number): Promise<[Topic[], number]> {
    console.log("befor query")
    return this.repo.findAndCount({
      select: {
        id: true,
        title: true,
        description: true,
        orderIndex: true,
        createdAt: true,
      },
      order: { orderIndex: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOneWithProblems(topicId: string): Promise<Topic | null> {
    return this.repo.findOne({
      where: { id: topicId },
      relations: { problems: true },
      order: { problems: { orderIndex: 'ASC' } },
    });
  }
}
