/**
 * server.ts
 * Entry point — imports the configured app and starts the HTTP server.
 * Handles graceful shutdown on SIGTERM/SIGINT so in-flight requests
 * can complete before the process exits.
 */

import app from './app';
import { appConfig } from './config/app.config';

const server = app.listen(appConfig.port, () => {
  console.log('\n🎓 Student Management API');
  console.log('─────────────────────────────────────────');
  console.log(`🚀  Server running on http://localhost:${appConfig.port}`);
  console.log(`📡  API base: http://localhost:${appConfig.port}${appConfig.apiPrefix}`);
  console.log(`❤️   Health:  http://localhost:${appConfig.port}/health`);
  console.log(`🌍  Mode:     ${appConfig.nodeEnv}`);
  console.log('─────────────────────────────────────────\n');
});

// Graceful shutdown — lets existing connections close cleanly
const shutdown = (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// Unhandled promise rejections — log and exit so the process-manager can restart
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled rejection:', reason);
  server.close(() => process.exit(1));
});
