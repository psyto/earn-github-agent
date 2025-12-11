# Setup Guide

This guide will help you set up the AI-Powered GitHub Auto-Review System.

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Redis 6.0+
- GitHub Personal Access Token
- OpenAI API Key (or OpenRouter API Key)

## Installation Steps

### 1. Install Dependencies

From the root directory:

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE earn_agent;
```

2. Update database credentials in `packages/earn-agent/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=earn_agent
```

3. Run migrations:
```bash
cd packages/earn-agent
npm run migrate
```

### 3. Redis Setup

1. Start Redis server:
```bash
redis-server
```

2. Update Redis configuration in `packages/earn-agent/.env` if needed:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. GitHub API Setup

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a token with `repo` scope

2. Add to `packages/earn-agent/.env`:
```env
GITHUB_TOKEN=your_github_token_here
```

### 5. LLM API Setup

Add your OpenAI API key to `packages/earn-agent/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 6. Environment Configuration

Copy example environment files:

```bash
# Backend
cp packages/earn-agent/.env.example packages/earn-agent/.env

# Frontend
cp packages/earn/.env.example packages/earn/.env
```

Edit the `.env` files with your actual credentials.

## Running the Services

### Development Mode

**Backend (earn-agent):**
```bash
npm run dev:agent
```

**Frontend (earn):**
```bash
npm run dev:frontend
```

The backend will be available at `http://localhost:3001` and the frontend at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

## Testing the System

1. Start both services (backend and frontend)
2. Use the frontend to trigger a GitHub review
3. Or use curl to test the API directly:

```bash
curl -X POST http://localhost:3001/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/owner/repo/pull/123",
    "bountyId": "bounty-123",
    "bountyRequirements": "Implement feature X with tests"
  }'
```

## Project Structure

```
earn-github-agent/
├── packages/
│   ├── earn-agent/          # Backend service
│   │   ├── src/
│   │   │   ├── jobs/        # BullMQ job processors
│   │   │   ├── services/    # GitHub fetcher, LLM reviewer
│   │   │   ├── database/    # Database models and migrations
│   │   │   ├── queues/      # BullMQ queue setup
│   │   │   ├── routes/      # API routes
│   │   │   └── types/       # TypeScript types
│   │   └── ...
│   └── earn/                # Frontend service
│       ├── src/
│       │   ├── app/         # Next.js app directory
│       │   ├── components/  # React components
│       │   └── lib/         # API client utilities
│       └── ...
└── README.md
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping` (should return `PONG`)
- Check Redis configuration in `.env`

### GitHub API Rate Limiting
- The system includes automatic rate limit handling with exponential backoff
- Consider using a GitHub App token for higher rate limits

### LLM API Errors
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Review token usage limits

## Next Steps

1. Review the [README.md](./README.md) for design details
2. Customize the LLM prompts in `packages/earn-agent/src/services/llm/reviewer.ts`
3. Adjust the scoring rubric and labels as needed
4. Integrate with your existing `earn` service API

