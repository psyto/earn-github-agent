# Usage Guide - GitHub Auto-Review System

## 🎉 System is Running!

Your GitHub auto-review system is now operational on **port 3002**.

## Quick Start

### 1. Test the API

**Health Check:**
```bash
curl http://localhost:3002/health
```

**Submit a Review Request:**
```bash
curl -X POST http://localhost:3002/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/owner/repo/pull/123",
    "bountyId": "bounty-123",
    "bountyRequirements": "Implement feature X with tests"
  }'
```

### 2. Check Review Results

**Via API:**
```bash
curl "http://localhost:3002/api/github/review/https%3A%2F%2Fgithub.com%2Fowner%2Frepo%2Fpull%2F123/bounty-123"
```

**Via Database:**
```bash
mysql -u root -e "USE earn_agent; SELECT * FROM github_reviews ORDER BY created_at DESC LIMIT 5;"
```

### 3. Frontend Integration

The frontend is configured to use port 3002. Start it with:
```bash
npm run dev:frontend
```

Then visit http://localhost:3000 and use the `GithubReviewButton` component.

## API Endpoints

### POST `/api/github/review`
Submit a GitHub PR or repository for review.

**Request Body:**
```json
{
  "submissionUrl": "https://github.com/owner/repo/pull/123",
  "bountyId": "unique-bounty-id",
  "bountyRequirements": "Requirements description here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review process initiated",
  "submissionUrl": "https://github.com/owner/repo/pull/123"
}
```

### GET `/api/github/review/:submissionUrl/:bountyId`
Retrieve review results.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "submission_url": "https://github.com/owner/repo/pull/123",
    "bounty_id": "bounty-123",
    "score": 85,
    "notes": "Well-structured code with good test coverage...",
    "labels": ["meets-criteria", "excellent-quality"],
    "status": "completed",
    "created_at": "2024-12-11T19:00:00.000Z"
  }
}
```

## How It Works

1. **Submit Review Request** → API receives request
2. **Queue Context Generation** → Fetches GitHub data (PR/repo info, diffs, commits)
3. **Queue Review Submission** → LLM analyzes code and generates review
4. **Save Results** → Stores score, notes, and labels in database
5. **Retrieve Results** → Query via API or database

## Review Output Format

Each review includes:

- **Score**: 0-100 rating
- **Notes**: Concise, actionable feedback (2-4 sentences)
- **Labels**: Array of relevant tags like:
  - `meets-criteria`
  - `needs-refactor`
  - `incomplete`
  - `excellent-quality`
  - `missing-tests`

## Monitoring

### Check Queue Status
```bash
# Connect to Redis CLI
redis-cli

# Check queue lengths
LLEN bull:github-generateContext:wait
LLEN bull:github-reviewSubmission:wait
```

### View Logs
The backend logs show:
- Job completion/failure
- Queue processing status
- API requests

### Database Queries

**Recent reviews:**
```sql
SELECT submission_url, score, status, created_at 
FROM github_reviews 
ORDER BY created_at DESC 
LIMIT 10;
```

**Failed reviews:**
```sql
SELECT submission_url, error, created_at 
FROM github_reviews 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

**Average scores:**
```sql
SELECT AVG(score) as avg_score, COUNT(*) as total_reviews 
FROM github_reviews 
WHERE status = 'completed';
```

## Customization

### Adjust LLM Prompts
Edit `packages/earn-agent/src/services/llm/reviewer.ts`:
- Modify `buildReviewPrompt()` function
- Change scoring criteria
- Update label categories

### Change Model
Edit `packages/earn-agent/src/services/llm/reviewer.ts`:
```typescript
model: openaiProvider('gpt-4-turbo-preview') // Change model here
```

### Adjust Rate Limiting
Edit `packages/earn-agent/src/services/github/rateLimiter.ts`:
- Modify retry logic
- Change backoff strategy

## Integration with Existing Earn Service

### Option 1: Direct API Calls
Your existing `earn` service can call the review API:
```typescript
const response = await fetch('http://localhost:3002/api/github/review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    submissionUrl,
    bountyId,
    bountyRequirements
  })
});
```

### Option 2: Database Integration
Query the `github_reviews` table directly from your `earn` service:
```sql
SELECT * FROM github_reviews 
WHERE submission_url = ? AND bounty_id = ?
```

### Option 3: Webhook/Event System
Add webhook notifications when reviews complete (future enhancement).

## Troubleshooting

### Review Stuck in Queue
- Check Redis is running: `redis-cli ping`
- Check worker logs for errors
- Verify API keys are valid

### Low Quality Reviews
- Adjust prompts in `reviewer.ts`
- Try different models (gpt-4, gpt-4-turbo)
- Provide more detailed bounty requirements

### Rate Limit Issues
- GitHub: System auto-handles with exponential backoff
- OpenAI: Check your usage limits

## Next Steps

1. **Test with Real Submissions** - Try various GitHub PRs/repos
2. **Tune Prompts** - Adjust for your specific use case
3. **Integrate Frontend** - Use the React components in your dashboard
4. **Add Monitoring** - Set up alerts for failed reviews
5. **Scale** - Consider multiple workers for high volume

## Production Considerations

- Set up proper error monitoring (Sentry, etc.)
- Add authentication to API endpoints
- Use environment-specific configurations
- Set up database backups
- Monitor API costs (OpenAI usage)
- Add request rate limiting
- Set up logging aggregation

