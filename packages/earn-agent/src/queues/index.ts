import { Queue } from 'bullmq';
import { redisConnection } from './redis';
import { generateContextProcessor } from '../jobs/github/generateContext';
import { reviewSubmissionProcessor } from '../jobs/github/reviewSubmission';

export const generateContextQueue = new Queue('github:generateContext', {
  connection: redisConnection,
});

export const reviewSubmissionQueue = new Queue('github:reviewSubmission', {
  connection: redisConnection,
});

export async function initializeQueues() {
  // Set up queue processors
  generateContextQueue.process('generate-context', generateContextProcessor);
  reviewSubmissionQueue.process('review-submission', reviewSubmissionProcessor);

  console.log('✅ Queues initialized');
}

