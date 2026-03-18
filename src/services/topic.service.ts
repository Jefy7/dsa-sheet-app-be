import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/ApiError';
import { TopicRepository } from '../repositories/topic.repository';

export class TopicService {
  constructor(private readonly topicRepository: TopicRepository = new TopicRepository()) {}

  async getTopics(page = 1, limit = 20) {
    const [topics, total] = await this.topicRepository.findPaginated(page, limit);
    return {
      items: topics,
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
