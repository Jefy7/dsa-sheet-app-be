import { Router } from 'express';
import { TopicController } from '../controllers/topic.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();
const controller = new TopicController();

router.get('/', authGuard, controller.getTopics);
router.get('/:topicId/problems', authGuard, controller.getTopicProblems);

export default router;
