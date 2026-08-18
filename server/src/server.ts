import { app } from './app.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma.');

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Smart Campus Management Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();
