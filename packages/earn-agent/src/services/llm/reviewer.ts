// @ts-ignore - generateObject is exported but TypeScript may not resolve it correctly
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { ReviewContext } from '../../types/jobs';
import { ReviewResult } from '../../types/review';

const ReviewResultSchema = z.object({
  score: z.number().min(0).max(100),
  notes: z.string(),
  labels: z.array(z.string()),
});

/**
 * Generates a review using LLM based on GitHub context and bounty requirements
 */
export async function generateReview(context: ReviewContext): Promise<ReviewResult> {
  const prompt = buildReviewPrompt(context);

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Create OpenAI provider with API key
    const openaiProvider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { object } = await generateObject({
      model: openaiProvider('gpt-4-turbo-preview'),
      schema: ReviewResultSchema,
      prompt,
    });

    return {
      score: object.score,
      notes: object.notes,
      labels: object.labels,
    };
  } catch (error) {
    console.error('Error generating review:', error);
    throw new Error(`Failed to generate review: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Builds the prompt for LLM review generation
 */
function buildReviewPrompt(context: ReviewContext): string {
  const { githubContext, bountyRequirements } = context;

  let contextSection = '';

  if (githubContext.type === 'pr') {
    contextSection = `
## Pull Request Information
- **Title:** ${githubContext.title}
- **Description:** ${githubContext.description || 'No description provided'}
- **Author:** ${githubContext.author}
- **State:** ${githubContext.state}
- **Files Changed:** ${githubContext.files.length} files
- **Commits:** ${githubContext.commits.length} commits

### Key File Changes:
${githubContext.files.slice(0, 20).map((f) => `- ${f.filename} (${f.status}): +${f.additions}/-${f.deletions}`).join('\n')}

### Recent Commits:
${githubContext.commits.slice(0, 10).map((c) => `- ${c.message}`).join('\n')}
`;
  } else {
    contextSection = `
## Repository Information
- **Name:** ${githubContext.name}
- **Description:** ${githubContext.description || 'No description provided'}
- **Language:** ${githubContext.language || 'Unknown'}
- **Stars:** ${githubContext.stars}
- **Forks:** ${githubContext.forks}

### Key Files:
${githubContext.keyFiles.map((f) => `- ${f.filename}`).join('\n')}

### Recent Commits:
${githubContext.recentCommits.map((c) => `- ${c.message}`).join('\n')}
`;
  }

  // Include key file contents (truncated if too long)
  const keyFilesContent = githubContext.keyFiles
    .map((f) => {
      const content = f.content.length > 2000 ? f.content.substring(0, 2000) + '...' : f.content;
      return `### ${f.filename}\n\`\`\`\n${content}\n\`\`\``;
    })
    .join('\n\n');

  return `You are an expert code reviewer evaluating a GitHub submission for a Superteam Earn bounty.

## Bounty Requirements
${bountyRequirements}

${contextSection}

${keyFilesContent ? `\n## Key File Contents\n${keyFilesContent}` : ''}

## Review Instructions
1. Evaluate how well the submission meets the bounty requirements
2. Assess code quality, structure, and best practices
3. Check for completeness and functionality
4. Provide constructive feedback

## Output Format
Provide a JSON object with:
- **score**: A number from 0-100 representing how well the submission meets requirements
- **notes**: Concise, actionable feedback (2-4 sentences)
- **labels**: Array of relevant labels (e.g., ["meets-criteria", "needs-refactor", "incomplete", "excellent-quality"])

Base your analysis ONLY on the provided context. Be objective and fair.`;
}

