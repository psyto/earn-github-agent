#!/bin/bash

# Setup script for environment variables
# This script copies .env.example files to .env files

set -e

echo "🔧 Setting up environment variables..."

# Get the project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Backend .env setup
if [ -f "$PROJECT_ROOT/packages/earn-agent/.env.example" ]; then
  if [ ! -f "$PROJECT_ROOT/packages/earn-agent/.env" ]; then
    cp "$PROJECT_ROOT/packages/earn-agent/.env.example" "$PROJECT_ROOT/packages/earn-agent/.env"
    echo "✅ Created packages/earn-agent/.env"
  else
    echo "⚠️  packages/earn-agent/.env already exists, skipping..."
  fi
else
  echo "❌ packages/earn-agent/.env.example not found!"
fi

# Frontend .env setup
if [ -f "$PROJECT_ROOT/packages/earn/.env.example" ]; then
  if [ ! -f "$PROJECT_ROOT/packages/earn/.env" ]; then
    cp "$PROJECT_ROOT/packages/earn/.env.example" "$PROJECT_ROOT/packages/earn/.env"
    echo "✅ Created packages/earn/.env"
  else
    echo "⚠️  packages/earn/.env already exists, skipping..."
  fi
else
  echo "❌ packages/earn/.env.example not found!"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit packages/earn-agent/.env and add your:"
echo "   - Database credentials (DB_USER, DB_PASSWORD)"
echo "   - GitHub token (GITHUB_TOKEN)"
echo "   - OpenAI API key (OPENAI_API_KEY)"
echo ""
echo "2. Edit packages/earn/.env if you need to change the backend URL"
echo ""
echo "3. See ENV_SETUP.md for detailed instructions"

