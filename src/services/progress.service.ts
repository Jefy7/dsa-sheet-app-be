import { StatusCodes } from 'http-status-codes';
import { UpdateProgressDto } from '../dtos/progress.dto';
import { ApiError } from '../errors/ApiError';
import { ProblemRepository } from '../repositories/problem.repository';
import { ProgressRepository } from '../repositories/progress.repository';
import { redis } from '../lib/redis';
import { UserProgress } from '../entities/UserProgress';

export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository = new ProgressRepository(),
    private readonly problemRepository: ProblemRepository = new ProblemRepository(),
  ) {}

  async getUserProgress(userId: string) {
    const key = `progress:${userId}`;
    const cached = await redis.get<UserProgress[]>(key);

    if (cached) {
      return cached;
    }

    const progress = await this.progressRepository.findByUser(userId);
    await redis.set(key, progress, { ex: 300 });

    return progress;
  }

  async updateProgress(userId: string, payload: UpdateProgressDto) {
    const problem = await this.problemRepository.findById(payload.problemId);
    if (!problem) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Problem not found');
    }

    const updatedProgress = await this.progressRepository.upsertProgress(userId, payload.problemId, payload.completed);

    await redis.del(`progress:${userId}`);
    await redis.flushall();

    return updatedProgress;
  }
}
