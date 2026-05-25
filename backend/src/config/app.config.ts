/**
 * config/app.config.ts
 * Centralises all environment / application configuration in one place.
 * Using a config object (instead of scattered process.env calls) makes
 * configuration explicit, typed, and easy to mock in tests.
 */

export const appConfig = {
  // Server
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  // API versioning prefix — all routes live under /api/v1/...
  apiPrefix: '/api/v1',

  // CORS — list of origins allowed to call this API
  // In production replace with your actual frontend domain(s)
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8080',
    'null', // Allow file:// origins for local HTML file testing
  ],
};
