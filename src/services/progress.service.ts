import { StatusCodes } from 'http-status-codes';
import { UpdateProgressDto } from '../dtos/progress.dto';
import { ApiError } from '../errors/ApiError';
import { ProblemRepository } from '../repositories/problem.repository';
import { ProgressRepository } from '../repositories/progress.repository';

export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository = new ProgressRepository(),
    private readonly problemRepository: ProblemRepository = new ProblemRepository(),
  ) {}

  getUserProgress(userId: string) {
    return this.progressRepository.findByUser(userId);
  }

  async updateProgress(userId: string, payload: UpdateProgressDto) {
    const problem = await this.problemRepository.findById(payload.problemId);
    if (!problem) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Problem not found');
    }

    return this.progressRepository.upsertProgress(userId, payload.problemId, payload.completed);
  }
}
