# Next Steps - Port 3002 Configuration ✅

## Current Status

- ✅ Backend configured for port 3002
- ✅ Frontend configured to use backend on port 3002
- ✅ Frontend running on port 3000 (Next.js default)
- ✅ Backend needs to be restarted to use port 3002

## Immediate Actions

### 1. Restart Backend on Port 3002

**Stop the current backend** (if running on 3001):
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

**Start backend on port 3002:**
```bash
npm run dev:agent
```

You should see:
```
🚀 Earn Agent service running on port 3002
```

### 2. Verify Everything Works

**Test Backend:**
```bash
curl http://localhost:3002/health
# Should return: {"status":"ok","service":"earn-agent"}
```

**Test Frontend:**
```bash
# Frontend should be on port 3000
open http://localhost:3000
```

**Test API Endpoint:**
```bash
curl -X POST http://localhost:3002/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/vercel/next.js/pull/12345",
    "bountyId": "test-1",
    "bountyRequirements": "Test review"
  }'
```

## What to Do Next

### Option 1: Test the System End-to-End

1. **Submit a Review Request** via API or frontend
2. **Monitor the Queue** - Check backend logs for job processing
3. **Check Results** - Query database or use GET endpoint
4. **Review Output Quality** - Check scores, notes, and labels

### Option 2: Integrate with Your Existing Earn Service

1. **API Integration** - Your `earn` service can call:
   ```
   POST http://localhost:3002/api/github/review
   GET http://localhost:3002/api/github/review/:url/:bountyId
   ```

2. **Database Integration** - Query `github_reviews` table directly

3. **Frontend Components** - Use `GithubReviewButton` and `ReviewResults` components

### Option 3: Customize and Improve

1. **Tune LLM Prompts** - Edit `packages/earn-agent/src/services/llm/reviewer.ts`
2. **Adjust Scoring** - Modify the review criteria
3. **Add More Labels** - Customize label categories
4. **Improve Error Handling** - Add better error messages

## Quick Reference

**Backend API:**
- Health: `http://localhost:3002/health`
- Submit Review: `POST http://localhost:3002/api/github/review`
- Get Review: `GET http://localhost:3002/api/github/review/:url/:bountyId`

**Frontend:**
- URL: `http://localhost:3000`
- API Config: `packages/earn/.env` → `NEXT_PUBLIC_AGENT_API_URL=http://localhost:3002`

**Database:**
```bash
mysql -u root -e "USE earn_agent; SELECT * FROM github_reviews ORDER BY created_at DESC LIMIT 5;"
```

## Testing Checklist

- [ ] Backend starts on port 3002
- [ ] Health endpoint responds
- [ ] Can submit review request
- [ ] Review job processes successfully
- [ ] Results appear in database
- [ ] Frontend can call backend API
- [ ] Review scores are reasonable
- [ ] Notes are helpful and accurate

## Next Phase: Production Readiness

Once testing is complete:

1. **Add Authentication** - Secure API endpoints
2. **Add Monitoring** - Set up error tracking and logging
3. **Optimize Performance** - Cache results, batch processing
4. **Scale Workers** - Multiple BullMQ workers for high volume
5. **Add Webhooks** - Notify when reviews complete
6. **Cost Monitoring** - Track OpenAI API usage

You're all set! Restart the backend and start testing. 🚀

