import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/ApiError';
import { TopicRepository } from '../repositories/topic.repository';
import { ProblemRepository } from '../repositories/problem.repository';
import { Problem } from '../entities/Problem';
import { redis } from '../lib/redis';

export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository = new TopicRepository(),
    private readonly problemRepository: ProblemRepository = new ProblemRepository(),
  ) { }

  async getTopics(page = 1, limit = 20) {
    const cacheKey = `topics:page:${page}:limit:${limit}`;
    const cached = await redis.get<{
      items: Array<{
        id: string;
        title: string;
        description: string;
        orderIndex: number;
        createdAt: Date;
        problems: Problem[];
      }>;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const [topics, total] = await this.topicRepository.findPaginated(page, limit);
    const topicIds = topics.map(t => t.id);

    const problems = await this.problemRepository.findByTopicIds(topicIds);

    const problemMap = new Map<string, Problem[]>();

    for (const problem of problems) {
      if (!problemMap.has(problem.topicId)) {
        problemMap.set(problem.topicId, []);
      }
      problemMap.get(problem.topicId)!.push(problem);
    }

    const topicsWithProblems = topics.map(topic => ({
      ...topic,
      problems: problemMap.get(topic.id) || [],
    }));

    const response = {
      items: topicsWithProblems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await redis.set(cacheKey, response, { ex: 300 });

    return response;
  }

  async getTopicProblems(topicId: string) {
    const topic = await this.topicRepository.findOneWithProblems(topicId);
    if (!topic) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Topic not found');
    }
    return topic;
  }
}
