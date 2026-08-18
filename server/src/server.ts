import { app } from './app.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma.');

    app.listen(PORT, () => {
      console.log(`🚀 Smart Campus Management Server running on port ${PORT}`);
      console.log(`📑 OpenAPI Swagger UI available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();
