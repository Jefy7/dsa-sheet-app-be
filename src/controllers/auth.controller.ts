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

  private getCookieOptions(maxAge: number) {
    const secureCookie = process.env.NODE_ENV === 'production';
    const sameSite = secureCookie ? 'none' : 'lax';

    return {
      httpOnly: true,
      secure: secureCookie,
      sameSite,
      maxAge,
    } as const;
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(
      AUTH_COOKIE_NAME,
      accessToken,
      this.getCookieOptions(ACCESS_TOKEN_MAX_AGE_MS),
    );

    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      this.getCookieOptions(REFRESH_TOKEN_MAX_AGE_MS),
    );
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, this.getCookieOptions(0));
    res.clearCookie(REFRESH_COOKIE_NAME, this.getCookieOptions(0));
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

  logout = async (req: Request, res: Response) => {
    await this.authService.logout(req.user!.userId);
    this.clearAuthCookies(res);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logout successful',
    });
  };
}
