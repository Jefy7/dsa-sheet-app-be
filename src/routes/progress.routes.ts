import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { UpdateProgressDto } from '../dtos/progress.dto';
import { authGuard } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const controller = new ProgressController();

router.get('/', authGuard, asyncHandler(controller.getProgress));
router.post('/update', authGuard, validateBody(UpdateProgressDto), asyncHandler(controller.updateProgress));

export default router;
