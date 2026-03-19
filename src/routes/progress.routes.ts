import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { UpdateProgressDto } from '../dtos/progress.dto';
import { authGuard } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';

const router = Router();
const controller = new ProgressController();

router.get('/', authGuard, controller.getProgress);
router.post('/update', authGuard, validateBody(UpdateProgressDto), controller.updateProgress);

export default router;
