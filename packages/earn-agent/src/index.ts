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
    const port = process.env.PORT || 3001;

    server.listen(port, () => {
      console.log(`🚀 Earn Agent service running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

