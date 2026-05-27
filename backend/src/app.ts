

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { appConfig } from './config/app.config';
import studentRoutes from './routes/student.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logger.middleware';

const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (e.g. curl, Postman, same-origin)
      if (!origin || appConfig.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
//app.use--a function between request and response 
// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));
// Parse URL-encoded form bodies
app.use(express.urlencoded({ extended: true }));

// Log every request
app.use(requestLogger);

// ── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Student Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────

// Version prefix applied once here — routes don't need to repeat it
app.use(`${appConfig.apiPrefix}/students`, studentRoutes);

// ── Error Handling ───────────────────────────────────────────────────────────

// Must come AFTER all routes
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
