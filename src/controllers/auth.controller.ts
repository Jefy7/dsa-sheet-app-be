import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) { }

  register = async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      user: user,
    });
  };

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    res.cookie(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      user: result.user,
    });
  };

  me = async (req: Request, res: Response) => {
    const user = await this.authService.me(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Current user fetched successfully',
      user: user,
    });
  };
}
