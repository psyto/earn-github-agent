'use client';

import { useState } from 'react';
import { triggerGitHubReview } from '@/lib/api';

interface GithubReviewButtonProps {
  submissionUrl: string;
  bountyId: string;
  bountyRequirements: string;
}

export function GithubReviewButton({
  submissionUrl,
  bountyId,
  bountyRequirements,
}: GithubReviewButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await triggerGitHubReview({
        submissionUrl,
        bountyId,
        bountyRequirements,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleReview}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Trigger GitHub Review'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">Review initiated successfully!</p>}
    </div>
  );
}

