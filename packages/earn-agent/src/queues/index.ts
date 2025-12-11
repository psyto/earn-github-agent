import { Queue, Worker } from 'bullmq';
import { redisConnection } from './redis';
import { generateContextProcessor } from '../jobs/github/generateContext';
import { reviewSubmissionProcessor } from '../jobs/github/reviewSubmission';

export const generateContextQueue = new Queue('github-generateContext', {
  connection: redisConnection,
});

export const reviewSubmissionQueue = new Queue('github-reviewSubmission', {
  connection: redisConnection,
});

let generateContextWorker: Worker | null = null;
let reviewSubmissionWorker: Worker | null = null;

export async function initializeQueues() {
  // Set up queue workers (processors)
  generateContextWorker = new Worker(
    'github-generateContext',
    generateContextProcessor,
    {
      connection: redisConnection,
    }
  );

  reviewSubmissionWorker = new Worker(
    'github-reviewSubmission',
    reviewSubmissionProcessor,
    {
      connection: redisConnection,
    }
  );

  // Handle worker events
  generateContextWorker.on('completed', (job) => {
    console.log(`✅ Context generation job ${job.id} completed`);
  });

  generateContextWorker.on('failed', (job, err) => {
    console.error(`❌ Context generation job ${job?.id} failed:`, err);
  });

  reviewSubmissionWorker.on('completed', (job) => {
    console.log(`✅ Review submission job ${job.id} completed`);
  });

  reviewSubmissionWorker.on('failed', (job, err) => {
    console.error(`❌ Review submission job ${job?.id} failed:`, err);
  });

  console.log('✅ Queues initialized');
}
