import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validateDto } from '../validators/validateDto';

export const validateBody = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await validateDto(dtoClass, req.body);
      next();
    } catch (error) {
      const details = error instanceof Error ? JSON.parse(error.message) : error;
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        error: details,
      });
    }
  };
};
