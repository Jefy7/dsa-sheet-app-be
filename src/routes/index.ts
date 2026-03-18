import { Router } from 'express';
import authRoutes from './auth.routes';
import topicRoutes from './topic.routes';
import progressRoutes from './progress.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/progress', progressRoutes);

export default router;
