# Redis Notes

## Redis is Already Running! ✅

Redis was installed and started as a **background service** via Homebrew. You don't need to run `redis-server` manually.

### Current Status

- **Service**: Running in background
- **Auto-start**: Enabled (starts on login)
- **Port**: 6379 (default)
- **Status**: Check with `brew services list | grep redis`

### Commands

```bash
# Test Redis (should return PONG)
redis-cli ping

# Check Redis status
brew services list | grep redis

# View Redis info
redis-cli info

# Connect to Redis CLI
redis-cli
```

### If You Need to Run redis-server Manually

**You usually don't need to**, but if you want to:

```bash
# Option 1: Use full path
/opt/homebrew/opt/redis/bin/redis-server

# Option 2: Add to PATH (add to ~/.zshrc)
export PATH="/opt/homebrew/opt/redis/bin:$PATH"

# Option 3: Use Homebrew's symlink
brew link redis
```

**Note**: If Redis is already running as a service, running `redis-server` manually will fail because port 6379 is already in use.

### Service Management

```bash
# Stop Redis service
brew services stop redis

# Start Redis service
brew services start redis

# Restart Redis service
brew services restart redis
```

### Why redis-server Command Not Found?

The `redis-server` binary exists at `/opt/homebrew/opt/redis/bin/redis-server` but isn't in your PATH. This is normal - you typically use `brew services` to manage Redis, not run it directly.

Since Redis is already running as a service, you can use `redis-cli` (which is in PATH) to interact with it.

