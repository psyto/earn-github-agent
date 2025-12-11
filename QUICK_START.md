# Quick Start Guide

## 1. Environment Variables Setup ✅

Environment variable files have been created! You need to configure them with your actual credentials.

### Backend Configuration (`packages/earn-agent/.env`)

**Required values to update:**

1. **Database Password** (if your MySQL has a password):

    ```env
    DB_PASSWORD=your_mysql_password
    ```

2. **GitHub Token**:

    ```env
    GITHUB_TOKEN=ghp_your_actual_token_here
    ```

    - Get from: https://github.com/settings/tokens
    - Scopes needed: `public_repo` or `repo`

3. **OpenAI API Key**:
    ```env
    OPENAI_API_KEY=sk-your_actual_key_here
    ```
    - Get from: https://platform.openai.com/api-keys

### Frontend Configuration (`packages/earn/.env`)

**Usually no changes needed** - defaults to `http://localhost:3001`

---

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Infrastructure

### MySQL Database

**Option A: Install via Homebrew (Recommended)**

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Create database (no password by default, or use -p if you set one)
mysql -u root -e "CREATE DATABASE earn_agent;"
```

**Option B: Use Docker (Quick Setup)**

```bash
# Start MySQL in Docker
docker run --name mysql-earn-agent \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=earn_agent \
  -p 3306:3306 \
  -d mysql:8.0

# Update packages/earn-agent/.env:
# DB_HOST=127.0.0.1
# DB_PASSWORD=rootpassword
```

**Option C: If MySQL is already installed but not running**

```bash
# Try starting via Homebrew
brew services start mysql

# Or if installed via MySQL installer, check System Preferences
# Look for "MySQL" in System Preferences and start it
```

See [docs/MYSQL_SETUP.md](./docs/MYSQL_SETUP.md) for detailed MySQL setup options.

### Redis

**Quick Setup:**

```bash
npm run redis:start
```

**Manual Setup:**

```bash
# Install Redis (if not installed)
brew install redis

# Start Redis service
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

See [docs/REDIS_SETUP.md](./docs/REDIS_SETUP.md) for detailed Redis setup options.

## 4. Run Database Migrations

```bash
cd packages/earn-agent
npm run migrate
```

## 5. Start Services

**Terminal 1 - Backend:**

```bash
npm run dev:agent
```

**Terminal 2 - Frontend:**

```bash
npm run dev:frontend
```

## 6. Test the System

### Option 1: Use the Frontend

-   Open http://localhost:3000
-   Use the GitHub review button component

### Option 2: Test API Directly

```bash
curl -X POST http://localhost:3001/api/github/review \
  -H "Content-Type: application/json" \
  -d '{
    "submissionUrl": "https://github.com/owner/repo/pull/123",
    "bountyId": "bounty-123",
    "bountyRequirements": "Implement feature X with tests"
  }'
```

## Troubleshooting

### "Cannot connect to database"

-   Verify MySQL is running: `mysql -u root -p`
-   Check credentials in `packages/earn-agent/.env`
-   Ensure database exists: `CREATE DATABASE earn_agent;`

### "Redis connection failed"

-   Start Redis: `redis-server`
-   Verify: `redis-cli ping` (should return `PONG`)

### "GitHub API error"

-   Verify your token is correct
-   Check token has required scopes
-   Token should start with `ghp_`

### "OpenAI API error"

-   Verify API key is correct
-   Check your OpenAI account has credits
-   Key should start with `sk-`

## Next Steps

-   See [SETUP.md](./SETUP.md) for detailed setup instructions
-   See [ENV_SETUP.md](./ENV_SETUP.md) for environment variable details
-   See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture overview
