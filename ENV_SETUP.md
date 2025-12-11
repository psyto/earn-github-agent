# Environment Variables Setup Guide

This guide will help you configure all required environment variables for the project.

## Quick Setup

1. **Backend (earn-agent)**: Edit `packages/earn-agent/.env`
2. **Frontend (earn)**: Edit `packages/earn/.env`

## Required Environment Variables

### Backend Service (`packages/earn-agent/.env`)

#### Server Configuration
```env
PORT=3001
```
- **Description**: Port for the backend API server
- **Default**: `3001`
- **Required**: No (has default)

#### Database Configuration
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=earn_agent
```
- **Description**: MySQL database connection settings
- **Required**: Yes
- **Setup**: 
  1. Create MySQL database: `CREATE DATABASE earn_agent;`
  2. Update credentials to match your MySQL setup

#### Redis Configuration
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```
- **Description**: Redis connection for BullMQ queues
- **Required**: Yes (Redis must be running)
- **Setup**: 
  - If Redis has a password, add it to `REDIS_PASSWORD`
  - Default Redis setup usually doesn't require a password

#### GitHub API Configuration
```env
GITHUB_TOKEN=your_github_token_here
```
- **Description**: GitHub Personal Access Token for API access
- **Required**: Yes
- **How to get**:
  1. Go to https://github.com/settings/tokens
  2. Click "Generate new token" → "Generate new token (classic)"
  3. Select scopes:
     - `public_repo` (for public repositories)
     - `repo` (if you need to access private repositories)
  4. Copy the token and paste it here
- **Security**: Keep this token secret! Never commit it to version control.

#### LLM API Configuration
```env
OPENAI_API_KEY=your_openai_api_key_here
```
- **Description**: OpenAI API key for LLM review generation
- **Required**: Yes
- **How to get**:
  1. Go to https://platform.openai.com/api-keys
  2. Sign up or log in
  3. Click "Create new secret key"
  4. Copy the key and paste it here
- **Alternative**: You can use OpenRouter or other compatible APIs by modifying the LLM service
- **Security**: Keep this key secret! Never commit it to version control.

### Frontend Service (`packages/earn/.env`)

#### Backend API URL
```env
NEXT_PUBLIC_AGENT_API_URL=http://localhost:3001
```
- **Description**: URL of the backend earn-agent service
- **Required**: Yes
- **Default**: `http://localhost:3001`
- **Production**: Update this to your production backend URL

## Setup Checklist

- [ ] MySQL database created and credentials configured
- [ ] Redis server running (check with `redis-cli ping`)
- [ ] GitHub token generated and added to `.env`
- [ ] OpenAI API key obtained and added to `.env`
- [ ] Backend `.env` file configured
- [ ] Frontend `.env` file configured

## Verification

### Test Database Connection
```bash
mysql -u root -p -e "USE earn_agent; SHOW TABLES;"
```

### Test Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### Test GitHub Token
```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" https://api.github.com/user
```

### Test OpenAI API Key
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"
```

## Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use different tokens/keys for development and production**
3. **Rotate tokens regularly**
4. **Use environment-specific `.env` files**:
   - `.env.development`
   - `.env.production`
   - `.env.test`

## Troubleshooting

### "Database connection failed"
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE earn_agent;`

### "Redis connection failed"
- Verify Redis is running: `redis-cli ping`
- Check Redis configuration in `.env`
- Start Redis: `redis-server`

### "GitHub API rate limit exceeded"
- Check your token permissions
- Wait for rate limit reset (usually 1 hour)
- Consider using a GitHub App token for higher limits

### "OpenAI API error"
- Verify API key is correct
- Check your OpenAI account has credits
- Review API usage limits

## Production Deployment

For production, use environment variables from your hosting platform:

- **Vercel/Netlify**: Set in dashboard under "Environment Variables"
- **Docker**: Use `docker-compose.yml` with `env_file`
- **Kubernetes**: Use Secrets and ConfigMaps
- **AWS/GCP/Azure**: Use their respective secret management services

Never hardcode secrets in your code!

