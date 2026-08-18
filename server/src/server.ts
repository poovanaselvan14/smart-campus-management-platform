import { app } from './app.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Smart Campus Management Server running on port ${PORT}`);
});

// Non-blocking database connection initialization
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma.');
  } catch (error: any) {
    console.error('⚠️ Database connection warning:', error.message);
  }
})();

// Global safety error handlers
process.on('unhandledRejection', (reason: any) => {
  console.error('[SERVER_UNHANDLED_REJECTION]', reason);
});

process.on('uncaughtException', (error: any) => {
  console.error('[SERVER_UNCAUGHT_EXCEPTION]', error.message);
});
