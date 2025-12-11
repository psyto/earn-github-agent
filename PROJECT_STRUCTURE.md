# Project Structure Overview

This document provides an overview of the project structure for the AI-Powered GitHub Auto-Review System.

## Monorepo Structure

The project is organized as a monorepo with two main packages:

```
earn-github-agent/
├── packages/
│   ├── earn-agent/     # Backend service (TypeScript/Node.js)
│   └── earn/           # Frontend service (Next.js/React)
├── package.json         # Root workspace configuration
├── README.md            # Design document
├── SETUP.md             # Setup instructions
└── .gitignore
```

## Backend Service (`packages/earn-agent/`)

### Core Structure

```
earn-agent/
├── src/
│   ├── index.ts                    # Application entry point
│   ├── server.ts                   # Express server setup
│   │
│   ├── routes/                     # API routes
│   │   └── github.ts              # GitHub review endpoints
│   │
│   ├── queues/                     # BullMQ queue configuration
│   │   ├── index.ts               # Queue initialization
│   │   └── redis.ts               # Redis connection
│   │
│   ├── jobs/                       # Job processors
│   │   └── github/
│   │       ├── generateContext.ts  # Context generation job
│   │       └── reviewSubmission.ts # Review processing job
│   │
│   ├── services/                   # Business logic services
│   │   ├── github/
│   │   │   ├── fetcher.ts         # GitHub API data fetching
│   │   │   └── rateLimiter.ts     # Rate limit handling
│   │   └── llm/
│   │       └── reviewer.ts        # LLM review generation
│   │
│   ├── database/                   # Database layer
│   │   ├── index.ts               # Database initialization
│   │   ├── pool.ts                # MySQL connection pool
│   │   ├── reviews.ts             # Review data access
│   │   ├── migrate.ts             # Migration runner
│   │   └── migrations/
│   │       └── 001_create_github_reviews_table.sql
│   │
│   ├── cron/                       # Scheduled jobs
│   │   ├── index.ts               # Cron initialization
│   │   └── githubReviews.ts       # Auto-review scheduler
│   │
│   └── types/                      # TypeScript type definitions
│       ├── github.ts              # GitHub API types
│       ├── jobs.ts                # Job data types
│       └── review.ts              # Review result types
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Key Components

1. **API Routes** (`routes/github.ts`)
   - `POST /api/github/review` - Trigger a review
   - `GET /api/github/review/:submissionUrl/:bountyId` - Get review results

2. **Job Processors**
   - `generateContext`: Fetches GitHub data and prepares context
   - `reviewSubmission`: Generates review using LLM

3. **Services**
   - **GitHub Fetcher**: Handles PR/repo data fetching with rate limiting
   - **LLM Reviewer**: Generates structured reviews using AI

4. **Database**
   - MySQL schema for storing review results
   - Migration system for schema updates

## Frontend Service (`packages/earn/`)

### Core Structure

```
earn/
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   │
│   ├── components/                 # React components
│   │   ├── GithubReviewButton.tsx # Trigger review button
│   │   └── ReviewResults.tsx      # Display review results
│   │
│   ├── lib/                        # Utility libraries
│   │   └── api.ts                 # API client functions
│   │
│   └── types/                      # TypeScript types
│       └── review.ts              # Review types
│
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.example
```

### Key Components

1. **GithubReviewButton**: Component to trigger GitHub reviews
2. **ReviewResults**: Component to display review scores, notes, and labels
3. **API Client**: Functions to communicate with the backend service

## Data Flow

```
Frontend (earn)
    ↓ POST /api/github/review
Backend (earn-agent)
    ↓ Queue: github:generateContext
Job: generateContext
    ↓ Fetch GitHub data
    ↓ Queue: github:reviewSubmission
Job: reviewSubmission
    ↓ Generate review via LLM
    ↓ Save to database
    ↓ Return results
Frontend displays results
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Queue System**: BullMQ
- **Cache/Queue**: Redis
- **Database**: MySQL 8.0+
- **GitHub API**: @octokit/rest
- **LLM**: Vercel AI SDK + OpenAI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18
- **HTTP Client**: Axios

## Environment Variables

### Backend (`packages/earn-agent/.env`)
- `PORT` - Server port (default: 3001)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL config
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` - Redis config
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `OPENAI_API_KEY` - OpenAI API key

### Frontend (`packages/earn/.env`)
- `NEXT_PUBLIC_AGENT_API_URL` - Backend API URL (default: http://localhost:3001)

## Next Steps

1. Follow the setup guide in `SETUP.md`
2. Configure environment variables
3. Run database migrations
4. Start Redis server
5. Start both services
6. Test the review flow

For detailed setup instructions, see [SETUP.md](./SETUP.md).

