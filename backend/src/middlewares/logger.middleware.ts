/**
 * middlewares/logger.middleware.ts
 * Lightweight request logger — logs method, URL, status, and duration.
 * In production you'd replace this with a proper library (morgan, pino, etc.)
 */

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Hook into the 'finish' event so we can log the final status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500 ? '\x1b[31m' : // red
      res.statusCode >= 400 ? '\x1b[33m' : // yellow
      res.statusCode >= 300 ? '\x1b[36m' : // cyan
      '\x1b[32m';                           // green
    const reset = '\x1b[0m';

    console.log(
      `${statusColor}[${res.statusCode}]${reset} ${req.method} ${req.originalUrl} — ${duration}ms`,
    );
  });

  next();
};
