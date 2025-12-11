#!/bin/bash

# Script to install and start Redis via Homebrew

set -e

echo "🍺 Setting up Redis via Homebrew..."

# Check if Redis is installed
if ! brew list redis &>/dev/null; then
  echo "📦 Installing Redis..."
  brew install redis
else
  echo "✅ Redis is already installed"
fi

# Start Redis service
echo "🚀 Starting Redis service..."
brew services start redis

# Wait a moment for Redis to start
sleep 2

# Test Redis connection
echo "🧪 Testing Redis connection..."
if redis-cli ping | grep -q "PONG"; then
  echo "✅ Redis is running and responding!"
  echo ""
  echo "📝 Redis is ready to use!"
  echo "   Connection: redis-cli"
  echo "   Test: redis-cli ping (should return PONG)"
else
  echo "⚠️  Redis may not be fully started yet. Try: redis-cli ping"
fi

