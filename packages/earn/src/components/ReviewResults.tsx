'use client';

import { useEffect, useState } from 'react';
import { getReviewResults } from '@/lib/api';
import { ReviewResult } from '@/types/review';

interface ReviewResultsProps {
  submissionUrl: string;
  bountyId: string;
}

export function ReviewResults({ submissionUrl, bountyId }: ReviewResultsProps) {
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReview();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadReview, 5000);
    return () => clearInterval(interval);
  }, [submissionUrl, bountyId]);

  const loadReview = async () => {
    try {
      const result = await getReviewResults(submissionUrl, bountyId);
      setReview(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading review results...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!review) {
    return <div>No review results yet.</div>;
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Review Score</h3>
        <div className="text-3xl font-bold">{review.score}/100</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${review.score}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Review Notes</h3>
        <p className="text-gray-700">{review.notes}</p>
      </div>

      {review.labels && review.labels.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Labels</h3>
          <div className="flex flex-wrap gap-2">
            {review.labels.map((label, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

