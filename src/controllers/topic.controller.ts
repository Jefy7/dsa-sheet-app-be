import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TopicService } from '../services/topic.service';

export class TopicController {
  constructor(private readonly topicService: TopicService = new TopicService()) {}

  getTopics = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);

    const result = await this.topicService.getTopics(page, limit);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Topics fetched successfully',
      data: result,
    });
  };

  getTopicProblems = async (req: Request<{ topicId: string }>, res: Response): Promise<void> => {
    const topic = await this.topicService.getTopicProblems(req.params.topicId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Topic problems fetched successfully',
      data: topic,
    });
  };
}
