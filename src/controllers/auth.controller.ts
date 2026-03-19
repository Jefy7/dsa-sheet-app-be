import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ACCESS_TOKEN_MAX_AGE_MS,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_MS,
} from '../constants/auth.constants';
import { ApiError } from '../errors/ApiError';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) { }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const secureCookie = process.env.NODE_ENV === 'production';
    const sameSite = secureCookie ? 'none' : 'lax';

    res.cookie(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: secureCookie,
      sameSite,
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: secureCookie,
      sameSite,
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
  }

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
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      user: result.user,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const currentRefreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!currentRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Missing refresh token');
    }

    const result = await this.authService.refresh(currentRefreshToken);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Token refreshed successfully',
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
