# Next Steps Guide

## ✅ Completed

- [x] Project structure created
- [x] Environment variables configured
- [x] Redis installed and running
- [x] TypeScript build errors fixed
- [x] Dependencies installed

## 🔧 Immediate Next Steps

### 1. Set Up MySQL Database (Required)

**Option A: Install via Homebrew**
```bash
npm run mysql:homebrew
```

**Option B: Use Docker**
```bash
npm run mysql:docker
```

**Then create the database:**
```bash
mysql -u root -p -e "CREATE DATABASE earn_agent;"
```

**Run migrations:**
```bash
cd packages/earn-agent
npm run migrate
```

### 2. Configure API Keys (Required)

Edit `packages/earn-agent/.env` and add your actual credentials:

```bash
# Get from: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_actual_token_here

# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_actual_key_here

# If MySQL has a password
DB_PASSWORD=your_mysql_password
```

### 3. Verify Services Are Running

```bash
# Check Redis
redis-cli ping
# Should return: PONG

# Check MySQL
mysql -u root -p -e "USE earn_agent; SHOW TABLES;"
# Should show: github_reviews table
```

### 4. Start the Backend Service

```bash
npm run dev:agent
```

You should see:
```
✅ Redis connected
✅ Database connected
✅ Queues initialized
✅ Cron jobs initialized
🚀 Earn Agent service running on port 3001
```

### 5. Test the API

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Test GitHub Review (requires API keys):**
```bash
curl -X POST http://localhost:3001/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/vercel/next.js/pull/12345",
    "bountyId": "test-bounty-1",
    "bountyRequirements": "Fix a bug in the Next.js framework"
  }'
```

### 6. Start the Frontend (Optional)

```bash
npm run dev:frontend
```

Visit http://localhost:3000

## 📋 Checklist

Before testing the full system:

- [ ] MySQL database created (`earn_agent`)
- [ ] Database migrations run (`npm run migrate`)
- [ ] GitHub token added to `.env`
- [ ] OpenAI API key added to `.env`
- [ ] MySQL password configured (if needed)
- [ ] Redis is running (`redis-cli ping`)
- [ ] Backend starts without errors
- [ ] Health endpoint responds

## 🐛 Troubleshooting

### MySQL Connection Issues
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql

# Or use Docker
npm run mysql:docker
```

### Port Already in Use
```bash
# Kill process on port 3001
npm run kill:port

# Or use a different port
# Edit packages/earn-agent/.env: PORT=3002
```

### Missing API Keys
- GitHub Token: https://github.com/settings/tokens
- OpenAI Key: https://platform.openai.com/api-keys

## 🎯 After Setup

Once everything is running:

1. **Test with a real GitHub PR/repo**
2. **Check the database** for review results
3. **Review the LLM output** quality
4. **Customize prompts** in `packages/earn-agent/src/services/llm/reviewer.ts`
5. **Adjust scoring** and labels as needed

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture overview

## 🚀 Production Deployment

When ready for production:

1. Set up production database (MySQL/PostgreSQL)
2. Configure production Redis
3. Set environment variables securely
4. Build: `npm run build`
5. Deploy backend and frontend separately
6. Set up monitoring and logging

