/**
 * utils/response.helper.ts
 * Factory helpers for building consistent API response objects.
 * Controllers call these instead of constructing raw objects — one place
 * to change the envelope shape if requirements ever shift.
 */

import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../interfaces/api-response.interface';

/**
 * Send a successful JSON response.
 * @param res      - Express response object
 * @param message  - Human-readable success message
 * @param data     - Payload (optional)
 * @param statusCode - HTTP status (default 200)
 * @param meta     - Pagination metadata (optional)
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: PaginationMeta,
): void => {
  const body: ApiResponse<T> = { success: true, message, data, meta };
  res.status(statusCode).json(body);
};

/**
 * Send an error JSON response.
 * @param res       - Express response object
 * @param message   - Human-readable error message
 * @param statusCode - HTTP status (default 500)
 */
export const sendError = (res: Response, message: string, statusCode = 500): void => {
  res.status(statusCode).json({ success: false, message });
};
