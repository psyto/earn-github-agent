export interface GitHubFile {
  filename: string;
  content: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface GitHubPRContext {
  type: 'pr';
  prNumber: number;
  title: string;
  description: string;
  state: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  files: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch: string;
  }>;
  commits: GitHubCommit[];
  keyFiles: GitHubFile[];
}

export interface GitHubRepoContext {
  type: 'repo';
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  keyFiles: GitHubFile[];
  recentCommits: GitHubCommit[];
}

export type GitHubContext = GitHubPRContext | GitHubRepoContext;

