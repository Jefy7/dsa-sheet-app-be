import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Topic } from '../entities/Topic';

export class TopicRepository {
  private readonly repo: Repository<Topic>;

  constructor() {
    this.repo = AppDataSource.getRepository(Topic);
  }

  async findPaginated(page: number, limit: number): Promise<[Topic[], number]> {
    return this.repo.findAndCount({
      relations: { problems: true },
      select: {
        id: true,
        title: true,
        description: true,
        orderIndex: true,
        createdAt: true,
        problems: {
          id: true,
          title: true,
          difficulty: true,
          orderIndex: true,
          topicId: true,
          youtubeLink: true,
          leetcodeLink: true,
          codeforcesLink: true,
          articleLink: true,
        },
      },
      order: { orderIndex: 'ASC', problems: { orderIndex: 'ASC' } },
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
