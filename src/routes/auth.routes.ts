import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { authGuard } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const controller = new AuthController();

router.post('/register', validateBody(RegisterDto), asyncHandler(controller.register));
router.post('/login', authRateLimiter, validateBody(LoginDto), asyncHandler(controller.login));
router.get('/me', authGuard, asyncHandler(controller.me));

export default router;
