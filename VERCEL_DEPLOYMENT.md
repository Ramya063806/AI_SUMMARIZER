# Vercel Deployment Guide

This project is set up for a split deployment:

- Backend on Render
- Frontend on Vercel

## Required Environment Variables

- Render backend: `GEMINI_API_KEY`
- Vercel frontend: `VITE_API_BASE_URL`

## Render Backend

1. Create a new Web Service from the repo.
2. Set the root directory to `backend`.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add `GEMINI_API_KEY` as a secret environment variable.

## Vercel Frontend

1. Import the repo in Vercel.
2. Keep the root build using `npm run build`.
3. Set `VITE_API_BASE_URL` to `https://ai-summarizer-0fz8.onrender.com`.
4. Deploy.

## Notes

- The frontend calls the backend through `VITE_API_BASE_URL` in production and falls back to relative `/api` calls in local development.
- `vercel.json` is configured for the Vite app, not for backend routing.
