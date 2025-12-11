# Port Configuration Guide

## Current Setup

- **Backend (earn-agent)**: Port 3001 (default) or 3002 (if changed)
- **Frontend (earn)**: Port 3000 (Next.js default)
- **Frontend API URL**: Points to backend port (configured in `packages/earn/.env`)

## Configuration Files

### Backend Port
**File**: `packages/earn-agent/.env`
```env
PORT=3002
```

### Frontend API URL
**File**: `packages/earn/.env`
```env
NEXT_PUBLIC_AGENT_API_URL=http://localhost:3002
```

## Verify Configuration

### Check Backend
```bash
curl http://localhost:3002/health
# Should return: {"status":"ok","service":"earn-agent"}
```

### Check Frontend
```bash
curl http://localhost:3000
# Should return HTML (Next.js app)
```

### Test API from Frontend
The frontend should call: `http://localhost:3002/api/github/review`

## Quick Test

```bash
# 1. Start backend (Terminal 1)
cd packages/earn-agent
npm run dev
# Should show: 🚀 Earn Agent service running on port 3002

# 2. Start frontend (Terminal 2)
cd packages/earn
npm run dev
# Should show: Ready on http://localhost:3000

# 3. Test backend API
curl http://localhost:3002/health

# 4. Test frontend
open http://localhost:3000
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9

# Or use the script
npm run kill:port
# (modify script to use 3002 if needed)
```

### Frontend Can't Connect to Backend
- Verify backend is running: `curl http://localhost:3002/health`
- Check `packages/earn/.env` has correct `NEXT_PUBLIC_AGENT_API_URL`
- Restart frontend after changing `.env`

### Wrong Port in Response
- Check both `.env` files match
- Restart both services after changing ports

