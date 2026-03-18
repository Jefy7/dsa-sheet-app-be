import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants';
import { env } from '../config/env';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  register = async (req: Request<unknown, unknown, RegisterDto>, res: Response): Promise<void> => {
    const user = await this.authService.register(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  };

  login = async (req: Request<unknown, unknown, LoginDto>, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);

    res.cookie(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: result.user,
    });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.me(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Current user fetched successfully',
      data: user,
    });
  };
}
