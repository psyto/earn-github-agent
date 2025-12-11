import 'dotenv/config';
import { createServer } from './server';
import { initializeQueues } from './queues';
import { initializeDatabase } from './database';
import { initializeCronJobs } from './cron';

async function main() {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Initialize BullMQ queues
    await initializeQueues();

    // Initialize cron jobs
    initializeCronJobs();

    // Start HTTP server
    const server = createServer();
    const port = parseInt(process.env.PORT || '3001', 10);

    server.listen(port, () => {
      console.log(`🚀 Earn Agent service running on port ${port}`);
    }).on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use.`);
        console.error(`   Try: lsof -ti:${port} | xargs kill -9`);
        console.error(`   Or change the port in .env: PORT=3002`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

