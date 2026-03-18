import { Router } from 'express';
import { TopicController } from '../controllers/topic.controller';
import { authGuard } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const controller = new TopicController();

router.get('/', authGuard, asyncHandler(controller.getTopics));
router.get('/:topicId/problems', authGuard, asyncHandler(controller.getTopicProblems));

export default router;
