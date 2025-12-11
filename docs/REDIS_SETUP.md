# Redis Setup Guide

## Quick Setup via Homebrew

Redis is required for BullMQ queues. Here's how to install and start it:

### Option 1: Use the Setup Script (Recommended)

```bash
npm run redis:start
```

Or directly:
```bash
bash scripts/start-redis.sh
```

### Option 2: Manual Installation

```bash
# Install Redis
brew install redis

# Start Redis service (runs in background)
brew services start redis

# Or start Redis manually (foreground)
redis-server

# Test Redis is working
redis-cli ping
# Should return: PONG
```

## Verify Redis is Running

```bash
# Check if Redis is running
redis-cli ping

# Check Redis service status
brew services list | grep redis

# Check Redis process
ps aux | grep redis
```

## Redis Configuration

By default, Redis runs on:
- **Host**: `localhost`
- **Port**: `6379`
- **Password**: None (for local development)

These defaults match the configuration in `packages/earn-agent/.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Using Redis CLI

```bash
# Connect to Redis CLI
redis-cli

# Common commands:
# - PING (test connection)
# - KEYS * (list all keys)
# - FLUSHALL (clear all data - use with caution!)
# - INFO (server information)
# - EXIT (quit)
```

## Troubleshooting

### "redis-cli: command not found"
- Redis is not installed: `brew install redis`

### "Connection refused"
- Redis is not running: `brew services start redis`
- Or start manually: `redis-server`

### "Redis service won't start"
- Check if port 6379 is in use: `lsof -i :6379`
- Check Redis logs: `brew services info redis`

### Stop Redis
```bash
# Stop Redis service
brew services stop redis

# Or if running manually, press Ctrl+C
```

## Production Considerations

For production, you may want to:
- Set a password: Edit `/opt/homebrew/etc/redis.conf` (or `/usr/local/etc/redis.conf`)
- Use Redis Cloud or AWS ElastiCache
- Configure persistence settings
- Set up Redis Sentinel for high availability

## Alternative: Docker Redis

If you prefer Docker:

```bash
docker run --name redis-earn-agent \
  -p 6379:6379 \
  -d redis:7-alpine

# Test
redis-cli -h 127.0.0.1 ping
```

Then update `.env`:
```env
REDIS_HOST=127.0.0.1
```

