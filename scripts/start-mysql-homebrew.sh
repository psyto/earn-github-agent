#!/bin/bash

# Script to install and start MySQL via Homebrew

set -e

echo "🍺 Setting up MySQL via Homebrew..."

# Check if MySQL is installed
if ! brew list mysql &>/dev/null; then
  echo "📦 Installing MySQL..."
  brew install mysql
else
  echo "✅ MySQL is already installed"
fi

# Start MySQL service
echo "🚀 Starting MySQL service..."
brew services start mysql

# Wait a moment for MySQL to start
sleep 3

# Create database
echo "📝 Creating database 'earn_agent'..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS earn_agent;" 2>/dev/null || {
  echo "⚠️  Could not create database automatically."
  echo "   You may need to set a root password first."
  echo "   Run: mysql_secure_installation"
  echo "   Then: mysql -u root -p -e 'CREATE DATABASE earn_agent;'"
}

echo ""
echo "✅ MySQL should be running now!"
echo ""
echo "🧪 Test connection:"
echo "   mysql -u root -e 'SHOW DATABASES;'"
echo ""
echo "📝 If you set a password, update packages/earn-agent/.env:"
echo "   DB_PASSWORD=your_password"


