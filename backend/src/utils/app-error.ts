/**
 * utils/app-error.ts
 * Custom error class that carries an HTTP status code.
 * Throwing an AppError from anywhere in the service layer lets the
 * centralised error-handling middleware respond with the correct status.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // "operational" errors are expected (404, 400, etc.) as opposed to
    // programming bugs — useful when deciding whether to alert on-call.
    this.isOperational = true;

    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
