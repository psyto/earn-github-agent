#!/bin/bash

# Script to kill process on a specific port

PORT=${1:-3001}

echo "🔍 Checking for processes on port $PORT..."

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✅ No process found on port $PORT"
  exit 0
fi

echo "📋 Found process(es): $PID"
echo "🛑 Killing process(es)..."

kill -9 $PID 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Successfully killed process on port $PORT"
else
  echo "❌ Failed to kill process. You may need to run with sudo."
  exit 1
fi

