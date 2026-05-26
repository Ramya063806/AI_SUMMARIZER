# Deployment Summary

The project is configured for a split deployment:

Frontend (React + Vite) -> Vercel
Backend (Express) -> Render

## Current Architecture

- Vercel serves the UI
- Render serves the API
- The frontend reads the backend URL from `VITE_API_BASE_URL`

## What You Need

- GitHub repository
- Render account
- Vercel account
- `GEMINI_API_KEY` on Render
- `VITE_API_BASE_URL` on Vercel

## Result

The app now supports a production frontend/backend split without hardcoded localhost API calls.
