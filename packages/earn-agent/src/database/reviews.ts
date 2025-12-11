import { getDatabase } from './index';

export interface ReviewResults {
  submissionUrl: string;
  bountyId: string;
  score?: number;
  notes?: string;
  labels?: string[];
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export async function saveReviewResults(results: ReviewResults) {
  const db = getDatabase();

  await db.execute(
    `INSERT INTO github_reviews 
     (submission_url, bounty_id, score, notes, labels, status, error, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE
     score = VALUES(score),
     notes = VALUES(notes),
     labels = VALUES(labels),
     status = VALUES(status),
     error = VALUES(error),
     updated_at = NOW()`,
    [
      results.submissionUrl,
      results.bountyId,
      results.score || null,
      results.notes || null,
      results.labels ? JSON.stringify(results.labels) : null,
      results.status,
      results.error || null,
    ]
  );
}

export async function getReviewResults(submissionUrl: string, bountyId: string) {
  const db = getDatabase();

  const [rows] = await db.execute(
    `SELECT * FROM github_reviews 
     WHERE submission_url = ? AND bounty_id = ?`,
    [submissionUrl, bountyId]
  );

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

