# Environment Setup Guide

## Local Development

Create a `.env` file with:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Optional:

```bash
PORT=3001
NODE_ENV=development
```

## Production on Vercel

Add this environment variable in the Vercel dashboard:

- `GEMINI_API_KEY`

## No Database Mode

This project no longer uses MongoDB or any other database.
All summarization happens in the backend and is returned directly to the client.
