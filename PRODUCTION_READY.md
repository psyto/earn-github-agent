# Production Readiness Guide

## 🎉 Congratulations! Your System is Operational

You've successfully set up the GitHub Auto-Review System. Here's what to do next to make it production-ready.

## Current Status Check

### ✅ What's Working
- Backend API running on port 3002
- Frontend running on port 3000
- Database and Redis connected
- Queue system operational
- API keys configured

## Next Steps: Testing & Validation

### 1. Test with Real GitHub Submissions

**Test with a Public PR:**
```bash
curl -X POST http://localhost:3002/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/vercel/next.js/pull/12345",
    "bountyId": "test-bounty-1",
    "bountyRequirements": "Fix a bug in the Next.js framework. Must include tests."
  }'
```

**Test with a Repository:**
```bash
curl -X POST http://localhost:3002/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/vercel/next.js",
    "bountyId": "test-bounty-2",
    "bountyRequirements": "Create a new feature with documentation"
  }'
```

**Check Results:**
```bash
# Wait 30-60 seconds, then check database
mysql -u root -e "USE earn_agent; SELECT submission_url, score, notes, labels, status FROM github_reviews ORDER BY created_at DESC LIMIT 1;"
```

### 2. Validate Review Quality

Review the generated scores and notes:
- Are scores reasonable (0-100)?
- Are notes helpful and actionable?
- Do labels make sense?
- Is the feedback accurate?

**If quality needs improvement:**
- Edit `packages/earn-agent/src/services/llm/reviewer.ts`
- Adjust the `buildReviewPrompt()` function
- Try different models (gpt-4, gpt-4-turbo-preview)

### 3. Test Edge Cases

**Test Invalid URLs:**
```bash
curl -X POST http://localhost:3002/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://invalid-url.com",
    "bountyId": "test-3",
    "bountyRequirements": "Test"
  }'
```

**Test Private Repos:**
- Should fail gracefully with clear error message

**Test Large PRs:**
- System should handle large diffs (may take longer)

## Integration Steps

### Option 1: API Integration

Your existing `earn` service can integrate via REST API:

```typescript
// In your earn service
async function triggerGitHubReview(submissionUrl: string, bountyId: string, requirements: string) {
  const response = await fetch('http://localhost:3002/api/github/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submissionUrl,
      bountyId,
      bountyRequirements: requirements
    })
  });
  return response.json();
}

async function getReviewResults(submissionUrl: string, bountyId: string) {
  const encodedUrl = encodeURIComponent(submissionUrl);
  const response = await fetch(
    `http://localhost:3002/api/github/review/${encodedUrl}/${bountyId}`
  );
  return response.json();
}
```

### Option 2: Database Integration

Query the `github_reviews` table directly:

```sql
-- Get review for a specific submission
SELECT * FROM github_reviews 
WHERE submission_url = ? AND bounty_id = ?;

-- Get all reviews for a bounty
SELECT * FROM github_reviews 
WHERE bounty_id = ? 
ORDER BY created_at DESC;

-- Get average score
SELECT AVG(score) as avg_score, COUNT(*) as total 
FROM github_reviews 
WHERE status = 'completed';
```

### Option 3: Frontend Components

Use the React components in your dashboard:

```tsx
import { GithubReviewButton } from '@/components/GithubReviewButton';
import { ReviewResults } from '@/components/ReviewResults';

// In your submission view
<GithubReviewButton
  submissionUrl={submission.url}
  bountyId={bounty.id}
  bountyRequirements={bounty.requirements}
/>

<ReviewResults
  submissionUrl={submission.url}
  bountyId={bounty.id}
/>
```

## Production Enhancements

### 1. Add Authentication

**Protect API Endpoints:**
```typescript
// Add middleware to verify API keys or JWT tokens
app.use('/api/github', authenticateMiddleware);
```

### 2. Add Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/github', limiter);
```

### 3. Add Monitoring & Logging

**Error Tracking:**
- Set up Sentry or similar
- Log all API errors
- Track failed reviews

**Metrics:**
- Review processing time
- Success/failure rates
- Average scores
- API usage

### 4. Add Webhooks/Notifications

Notify your `earn` service when reviews complete:

```typescript
// In reviewSubmission.ts, after saving results
await notifyEarnService({
  submissionUrl,
  bountyId,
  reviewResult
});
```

### 5. Optimize Performance

**Caching:**
- Cache GitHub API responses
- Cache review results (if requirements unchanged)

**Scaling:**
- Run multiple BullMQ workers
- Use Redis cluster for high availability
- Consider database read replicas

### 6. Cost Management

**Monitor OpenAI Usage:**
- Track token usage per review
- Set up billing alerts
- Consider caching similar reviews

**Optimize Prompts:**
- Reduce token usage where possible
- Use cheaper models for simple reviews
- Batch similar reviews

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API keys secured (use secrets management)
- [ ] Error handling tested
- [ ] Rate limiting configured
- [ ] Monitoring set up

### Deployment
- [ ] Deploy backend service
- [ ] Deploy frontend (or integrate components)
- [ ] Configure production database
- [ ] Set up Redis (or use managed service)
- [ ] Configure domain/SSL
- [ ] Set up CI/CD pipeline

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Verify queue processing
- [ ] Review cost metrics
- [ ] Gather user feedback

## Customization Guide

### Adjust Scoring Criteria

Edit `packages/earn-agent/src/services/llm/reviewer.ts`:

```typescript
// Modify the prompt to emphasize specific criteria
function buildReviewPrompt(context: ReviewContext): string {
  // Add custom scoring weights
  // Emphasize code quality, tests, documentation, etc.
}
```

### Add Custom Labels

Update the prompt to generate specific labels:

```typescript
// In buildReviewPrompt()
"labels": Array of relevant labels (e.g., [
  "meets-criteria", 
  "needs-refactor", 
  "incomplete", 
  "excellent-quality",
  "missing-tests",        // Add custom labels
  "needs-documentation",  // Add custom labels
  "security-concerns"     // Add custom labels
])
```

### Change Model

```typescript
// In reviewer.ts
model: openaiProvider('gpt-4-turbo-preview') // Change to gpt-4, gpt-3.5-turbo, etc.
```

## Troubleshooting Production Issues

### High Error Rate
- Check API keys are valid
- Verify GitHub token has correct scopes
- Check OpenAI account has credits
- Review error logs

### Slow Processing
- Increase BullMQ workers
- Optimize GitHub API calls
- Consider caching
- Use faster LLM models

### Inaccurate Reviews
- Refine prompts
- Provide more detailed requirements
- Use better models
- Add more context to prompts

## Support & Resources

- **Documentation**: See `USAGE_GUIDE.md` for API details
- **Architecture**: See `PROJECT_STRUCTURE.md` for system design
- **Setup**: See `SETUP.md` for installation guide

## You're Ready! 🚀

Your system is operational. Start testing with real submissions, validate the quality, and then integrate it into your existing `earn` service. Good luck!


