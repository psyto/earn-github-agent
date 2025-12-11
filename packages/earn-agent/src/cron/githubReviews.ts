import { generateContextQueue } from '../queues';
import { getDatabase } from '../database';

/**
 * Cron job to automatically review GitHub submissions after their deadline
 * This should be scheduled to run periodically (e.g., daily)
 */
export async function schedulePendingReviews() {
  const db = getDatabase();

  // Query for pending GitHub submissions that have passed their deadline
  // This is a placeholder - adjust based on your actual schema
  const [submissions] = await db.execute(
    `SELECT submission_url, bounty_id, bounty_requirements 
     FROM submissions 
     WHERE submission_type = 'github' 
     AND review_status = 'pending'
     AND deadline < NOW()
     LIMIT 100`
  );

  if (Array.isArray(submissions) && submissions.length > 0) {
    for (const submission of submissions as any[]) {
      await generateContextQueue.add('generate-context', {
        submissionUrl: submission.submission_url,
        bountyId: submission.bounty_id,
        bountyRequirements: submission.bounty_requirements || '',
      });
    }

    console.log(`✅ Scheduled ${submissions.length} pending reviews`);
  }
}

