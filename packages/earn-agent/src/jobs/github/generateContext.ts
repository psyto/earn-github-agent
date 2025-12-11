import { Job } from 'bullmq';
import { fetchGitHubData } from '../../services/github/fetcher';
import { reviewSubmissionQueue } from '../../queues';
import { ContextGenerationJobData } from '../../types/jobs';

export async function generateContextProcessor(job: Job<ContextGenerationJobData>) {
  const { submissionUrl, bountyId, bountyRequirements } = job.data;

  try {
    job.log(`Starting context generation for ${submissionUrl}`);

    // Fetch GitHub data (PR or repo)
    const githubContext = await fetchGitHubData(submissionUrl);

    // Package context for LLM
    const reviewContext = {
      githubContext,
      bountyRequirements,
      submissionUrl,
      bountyId,
    };

    // Queue the review submission job
    await reviewSubmissionQueue.add('review-submission', {
      submissionUrl,
      bountyId,
      reviewContext,
    });

    job.log('Context generated and review job queued');
    return { success: true, contextGenerated: true };
  } catch (error) {
    job.log(`Error generating context: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

