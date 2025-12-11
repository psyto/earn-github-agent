# MySQL Setup Guide

## Option 1: Install MySQL via Homebrew (Recommended)

This is the easiest way to get MySQL running on macOS:

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation (optional, sets root password)
mysql_secure_installation

# Verify it's running
mysql -u root -p
```

## Option 2: Use Docker (Quick & Isolated)

If you have Docker installed, you can run MySQL in a container:

```bash
# Run MySQL container
docker run --name mysql-earn-agent \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=earn_agent \
  -p 3306:3306 \
  -d mysql:8.0

# Connect to it
mysql -h 127.0.0.1 -u root -p
```

Then update your `.env` file:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=earn_agent
```

## Option 3: Use Cloud MySQL (Production-like)

For a production-like setup, you can use:
- **PlanetScale** (free tier): https://planetscale.com
- **Railway** (free tier): https://railway.app
- **Supabase** (free tier): https://supabase.com

## Option 4: Use SQLite for Development (Simplest)

If you want to get started quickly without MySQL, we can modify the code to use SQLite. This is fine for development but not recommended for production.

## Troubleshooting

### "Can't connect to local MySQL server"
- Make sure MySQL is running: `brew services list | grep mysql`
- Check if port 3306 is in use: `lsof -i :3306`
- Try connecting via TCP: `mysql -h 127.0.0.1 -u root -p`

### "Access denied"
- Reset root password: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
- Or create a new user: `CREATE USER 'earn_user'@'localhost' IDENTIFIED BY 'password';`

### Anaconda MySQL Issues
If MySQL was installed via Anaconda (unusual), you may want to:
1. Uninstall Anaconda MySQL: `conda remove mysql`
2. Install via Homebrew instead (Option 1)

## Recommended: Quick Docker Setup

For the fastest setup, use Docker:

```bash
# Start MySQL
docker run --name mysql-earn-agent \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=earn_agent \
  -p 3306:3306 \
  -d mysql:8.0

# Wait a few seconds for MySQL to start, then test
sleep 5
mysql -h 127.0.0.1 -u root -prootpassword -e "SHOW DATABASES;"
```

Then update `packages/earn-agent/.env`:
```env
DB_HOST=127.0.0.1
DB_PASSWORD=rootpassword
```

