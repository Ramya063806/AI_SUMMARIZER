# Deployment Checklist

## Before Deploying

- [ ] `GEMINI_API_KEY` is set locally or in Vercel
- [ ] `npm run build` works
- [ ] `npm run start --workspace backend` works
- [ ] No MongoDB or database env vars are required

## Vercel Settings

- Build Command: `npm run build`
- Output Directory: `frontend/dist`
- Environment Variables: `GEMINI_API_KEY`

## After Deploying

- [ ] Open the Vercel URL
- [ ] Submit sample text, file, or URL
- [ ] Confirm summary, drift analysis, and perspective views render
