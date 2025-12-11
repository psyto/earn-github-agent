import { GitHubContext } from './github';

export interface ContextGenerationJobData {
  submissionUrl: string;
  bountyId: string;
  bountyRequirements: string;
}

export interface ReviewContext {
  githubContext: GitHubContext;
  bountyRequirements: string;
  submissionUrl: string;
  bountyId: string;
}

export interface ReviewSubmissionJobData {
  submissionUrl: string;
  bountyId: string;
  reviewContext: ReviewContext;
}

