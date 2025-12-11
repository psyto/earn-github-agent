import { schedulePendingReviews } from './githubReviews';

/**
 * Initialize and schedule cron jobs
 */
export function initializeCronJobs() {
  // Schedule pending reviews every hour
  setInterval(async () => {
    try {
      await schedulePendingReviews();
    } catch (error) {
      console.error('Error running scheduled reviews:', error);
    }
  }, 60 * 60 * 1000); // Every hour

  console.log('✅ Cron jobs initialized');
}

