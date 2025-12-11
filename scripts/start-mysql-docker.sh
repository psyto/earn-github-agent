#!/bin/bash

# Script to start MySQL in Docker for development

set -e

CONTAINER_NAME="mysql-earn-agent"
MYSQL_PASSWORD="rootpassword"
MYSQL_DATABASE="earn_agent"
MYSQL_PORT="3306"

echo "🐳 Starting MySQL in Docker..."

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "📦 Container exists, checking status..."
  
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ MySQL container is already running!"
    echo "   Connection: mysql -h 127.0.0.1 -u root -p${MYSQL_PASSWORD}"
  else
    echo "🔄 Starting existing container..."
    docker start ${CONTAINER_NAME}
    echo "✅ MySQL container started!"
  fi
else
  echo "🆕 Creating new MySQL container..."
  docker run --name ${CONTAINER_NAME} \
    -e MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD} \
    -e MYSQL_DATABASE=${MYSQL_DATABASE} \
    -p ${MYSQL_PORT}:3306 \
    -d mysql:8.0
  
  echo "⏳ Waiting for MySQL to be ready..."
  sleep 5
  
  # Wait for MySQL to be ready
  for i in {1..30}; do
    if docker exec ${CONTAINER_NAME} mysqladmin ping -h localhost --silent; then
      echo "✅ MySQL is ready!"
      break
    fi
    echo "   Waiting... ($i/30)"
    sleep 1
  done
fi

echo ""
echo "📝 Update packages/earn-agent/.env with:"
echo "   DB_HOST=127.0.0.1"
echo "   DB_PASSWORD=${MYSQL_PASSWORD}"
echo ""
echo "🧪 Test connection:"
echo "   mysql -h 127.0.0.1 -u root -p${MYSQL_PASSWORD} -e 'SHOW DATABASES;'"

