import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/ApiError';
import { TopicRepository } from '../repositories/topic.repository';
import { ProblemRepository } from '../repositories/problem.repository';
import { Problem } from '../entities/Problem';

export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository = new TopicRepository(),
    private readonly problemRepository: ProblemRepository = new ProblemRepository(),
  ) { }

  async getTopics(page = 1, limit = 20) {
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
    console.log("topics length ", topics.length)
    return {
      items: topicsWithProblems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTopicProblems(topicId: string) {
    const topic = await this.topicRepository.findOneWithProblems(topicId);
    if (!topic) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Topic not found');
    }
    return topic;
  }
}
