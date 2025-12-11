import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:3001';

export interface ReviewRequest {
  submissionUrl: string;
  bountyId: string;
  bountyRequirements: string;
}

export async function triggerGitHubReview(request: ReviewRequest) {
  const response = await axios.post(`${API_BASE_URL}/api/github/review`, request);
  return response.data;
}

export async function getReviewResults(submissionUrl: string, bountyId: string) {
  // This would call your earn service API which then queries the database
  // Placeholder implementation
  const response = await axios.get(
    `${API_BASE_URL}/api/github/review/${encodeURIComponent(submissionUrl)}/${bountyId}`
  );
  return response.data;
}

