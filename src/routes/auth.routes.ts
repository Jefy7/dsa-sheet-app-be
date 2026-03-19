import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { authGuard } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { validateBody } from '../middlewares/validate.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', validateBody(RegisterDto), controller.register);
router.post('/login', authRateLimiter, validateBody(LoginDto), controller.login);
router.post('/refresh', controller.refresh);
router.get('/me', authGuard, controller.me);

export default router;
