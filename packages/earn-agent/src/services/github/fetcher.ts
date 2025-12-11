import { Octokit } from '@octokit/rest';
import { GitHubContext, GitHubPRContext, GitHubRepoContext } from '../../types/github';
import { withRetry } from './rateLimiter';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Fetches GitHub data for a PR or repository URL
 */
export async function fetchGitHubData(url: string): Promise<GitHubContext> {
  const { owner, repo, type, prNumber } = parseGitHubUrl(url);

  if (type === 'pr') {
    return await withRetry(() => fetchPRContext(owner, repo, prNumber!));
  } else {
    return await withRetry(() => fetchRepoContext(owner, repo));
  }
}

/**
 * Fetches PR context including diffs, commits, and metadata
 */
async function fetchPRContext(
  owner: string,
  repo: string,
  prNumber: number
): Promise<GitHubPRContext> {
  try {
    // Fetch PR details
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Fetch PR files (diffs)
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Fetch commits
    const { data: commits } = await octokit.pulls.listCommits({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Fetch key repository files (README, package.json, etc.)
    const keyFiles = await fetchKeyRepositoryFiles(owner, repo);

    return {
      type: 'pr',
      prNumber,
      title: pr.title,
      description: pr.body || '',
      state: pr.state,
      author: pr.user?.login || '',
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      files: files.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch || '',
      })),
      commits: commits.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name || '',
        date: c.commit.author?.date || '',
      })),
      keyFiles,
    };
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      if ((error as any).status === 404) {
        throw new Error(`PR not found or is private: ${owner}/${repo}#${prNumber}`);
      }
    }
    throw error;
  }
}

/**
 * Fetches repository context including README and key files
 */
async function fetchRepoContext(owner: string, repo: string): Promise<GitHubRepoContext> {
  try {
    // Fetch repository details
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch key repository files
    const keyFiles = await fetchKeyRepositoryFiles(owner, repo);

    // Fetch recent commits
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 10,
    });

    return {
      type: 'repo',
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || '',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      keyFiles,
      recentCommits: commits.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name || '',
        date: c.commit.author?.date || '',
      })),
    };
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      if ((error as any).status === 404) {
        throw new Error(`Repository not found or is private: ${owner}/${repo}`);
      }
    }
    throw error;
  }
}

/**
 * Fetches key repository files (README, package.json, etc.)
 */
async function fetchKeyRepositoryFiles(owner: string, repo: string) {
  const keyFileNames = ['README.md', 'package.json', 'tsconfig.json', 'Dockerfile', '.env.example'];
  const keyFiles: Array<{ filename: string; content: string }> = [];

  for (const filename of keyFileNames) {
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: filename,
      });

      if ('content' in data && data.type === 'file') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        keyFiles.push({ filename, content });
      }
    } catch (error) {
      // File doesn't exist or is not accessible, skip it
      continue;
    }
  }

  return keyFiles;
}

/**
 * Parses a GitHub URL to extract owner, repo, and type
 */
function parseGitHubUrl(url: string): {
  owner: string;
  repo: string;
  type: 'pr' | 'repo';
  prNumber?: number;
} {
  const prMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (prMatch) {
    return {
      owner: prMatch[1],
      repo: prMatch[2],
      type: 'pr',
      prNumber: parseInt(prMatch[3]),
    };
  }

  const repoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (repoMatch) {
    return {
      owner: repoMatch[1],
      repo: repoMatch[2],
      type: 'repo',
    };
  }

  throw new Error(`Invalid GitHub URL: ${url}`);
}
