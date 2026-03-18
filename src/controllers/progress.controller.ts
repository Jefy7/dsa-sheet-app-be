import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UpdateProgressDto } from '../dtos/progress.dto';
import { ProgressService } from '../services/progress.service';

export class ProgressController {
  constructor(private readonly progressService: ProgressService = new ProgressService()) {}

  getProgress = async (req: Request, res: Response): Promise<void> => {
    const items = await this.progressService.getUserProgress(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: items.length ? 'Progress fetched successfully' : 'No progress found yet',
      data: items,
    });
  };

  updateProgress = async (req: Request<unknown, unknown, UpdateProgressDto>, res: Response): Promise<void> => {
    const progress = await this.progressService.updateProgress(req.user!.userId, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    });
  };
}
