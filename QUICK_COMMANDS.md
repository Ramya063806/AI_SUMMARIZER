# Quick Deployment Commands

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# MONGO_URI=mongodb://localhost:27017/
# GEMINI_API_KEY=your_key_here

# Start local servers (frontend + backend)
npm run dev

# Start only backend
npm run start --workspace backend

# Build frontend only
npm run build --workspace frontend

# Test API health
curl http://localhost:3001/api/health
```

## Vercel Deployment

```bash
# Commit changes
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main

# Install Vercel CLI (one-time)
npm install -g vercel

# Initialize Vercel (first time only)
vercel

# Pull production environment variables locally
vercel env pull .env.vercel

# Test locally with production env
export $(cat .env.vercel | xargs)
npm run dev

# Redeploy to Vercel
vercel --prod
```

## MongoDB Setup

```bash
# Local MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or start manually
mongod

# Test connection
mongo

# Local MongoDB (Windows)
# Start MongoDB from Services or:
mongod --dbpath "C:\Program Files\MongoDB\Server\version\data\db"

# MongoDB Atlas
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create account and cluster
# 3. Create database user
# 4. Get connection string
# 5. Add to .env as MONGO_URI
```

## Environment Variables

```bash
# For local development, create .env with:
MONGO_URI=mongodb://localhost:27017/
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=development

# For Vercel deployment, set via dashboard:
# Settings → Environment Variables → Add:
# - MONGO_URI (MongoDB Atlas connection string)
# - GEMINI_API_KEY (same as local)
```

## Troubleshooting Commands

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# View backend logs
npm run start --workspace backend

# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules package-lock.json
npm install

# Kill process on port 3001 (Linux/macOS)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3001 (Windows PowerShell)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# View Vercel logs
vercel logs
```

## Verification Checklist

```bash
# 1. Backend starts
npm run start --workspace backend
# Expected: "Server running on port 3001"

# 2. API responds
curl http://localhost:3001/api/health
# Expected: {"ok":true}

# 3. Frontend builds
npm run build --workspace frontend
# Expected: Build completes without errors

# 4. Environment variables loaded
# Check backend console for any config errors
npm run start --workspace backend
# Should not show "MONGO_URI is undefined" or API key errors

# 5. MongoDB accessible
# Try connecting via client or MongoDB Compass
# Should be able to list databases

# 6. Gemini API working
# Check backend logs when summarizing
# Should not show authentication errors
```

## Production Deployment Checklist

```bash
# Before pushing to Vercel:

# 1. Verify build works locally
npm run build --workspace frontend

# 2. Ensure .env not in git
git status | grep ".env"  # Should NOT appear

# 3. Test with production environment
vercel env pull .env.production
export $(cat .env.production | xargs)
npm run start --workspace backend

# 4. Commit all changes
git add .
git commit -m "Ready for production"

# 5. Push to main (triggers Vercel auto-deploy)
git push origin main

# 6. Monitor deployment
# Go to https://vercel.com/dashboard → Your project → Deployments
# Wait for green checkmark

# 7. Test production API
curl https://your-project.vercel.app/api/health
```

## Performance Tips

```bash
# Monitor function execution time on Vercel
vercel analytics

# Check MongoDB connection pool usage
# Go to MongoDB Atlas → Clusters → Network Access → View current connections

# Optimize frontend build
npm run build --workspace frontend
# Check bundle size in dist/assets/

# Profile backend performance
# Add timing logs around expensive operations
```

## Common Issues & Fixes

```bash
# MongoDB connection timeout
# Solution: Add 0.0.0.0/0 to MongoDB Atlas IP whitelist

# CORS errors
# Check browser console, verify CORS headers in backend

# Build failures
# Clear cache: rm -rf node_modules && npm install
# Check logs: vercel logs --follow

# API key not found
# Verify GEMINI_API_KEY in Vercel environment variables

# Port already in use
# macOS/Linux: lsof -ti:3001 | xargs kill -9
# Windows: netstat -ano | findstr :3001 + taskkill

# Disk space issues
# Clean npm cache: npm cache clean --force
```
