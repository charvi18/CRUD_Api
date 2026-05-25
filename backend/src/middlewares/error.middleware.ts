/**
 * middlewares/error.middleware.ts
 * Centralised error handler — Express calls this whenever next(error) is
 * invoked anywhere in the request pipeline.
 *
 * By centralising here we avoid duplicating try/catch + res.status() logic
 * in every controller and ensure a consistent error envelope.
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/app-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Operational errors (AppError) have a meaningful statusCode
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unknown / programming errors — don't leak internals
  console.error('[UnhandledError]', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  });
};

// 404 handler — catches any request that didn't match a route
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
