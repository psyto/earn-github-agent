import { Job } from 'bullmq';
import { generateReview } from '../../services/llm/reviewer';
import { saveReviewResults } from '../../database/reviews';
import { ReviewSubmissionJobData } from '../../types/jobs';

export async function reviewSubmissionProcessor(job: Job<ReviewSubmissionJobData>) {
  const { submissionUrl, bountyId, reviewContext } = job.data;

  try {
    job.log(`Starting review for ${submissionUrl}`);

    // Generate review using LLM
    const reviewResult = await generateReview(reviewContext);

    // Save results to database
    await saveReviewResults({
      submissionUrl,
      bountyId,
      score: reviewResult.score,
      notes: reviewResult.notes,
      labels: reviewResult.labels,
      status: 'completed',
    });

    job.log(`Review completed. Score: ${reviewResult.score}`);
    return { success: true, score: reviewResult.score };
  } catch (error) {
    job.log(`Error reviewing submission: ${error instanceof Error ? error.message : String(error)}`);

    // Mark as failed in database
    await saveReviewResults({
      submissionUrl,
      bountyId,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}

