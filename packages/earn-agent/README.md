# Earn Agent Service

Backend service for processing GitHub auto-reviews.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start Redis server (required for BullMQ):
```bash
redis-server
```

5. Start the service:
```bash
npm run dev
```

## API Endpoints

### POST `/api/github/review`
Initiates a GitHub review process.

**Request Body:**
```json
{
  "submissionUrl": "https://github.com/owner/repo/pull/123",
  "bountyId": "bounty-123",
  "bountyRequirements": "Requirements here..."
}
```

## Architecture

- **Event Handlers**: `github:generateContext` and `github:reviewSubmission` queues
- **GitHub Service**: Fetches PR/repo data from GitHub API
- **LLM Service**: Generates reviews using OpenAI/OpenRouter
- **Database**: Stores review results in MySQL

