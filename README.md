# AI Content Summarizer

React front end and Node.js API for summarizing original content.

## Features

- Extractive and abstractive summarization
- Summary length, style, and tone controls
- Plain text, TXT, DOCX, PDF, and URL input
- Cognitive drift analysis with stability scoring and drift timelines
- Parallel perspective summaries for business, student, researcher, and critic views
- Presentation guide for feature explanation in [docs/PRESENTATION_GUIDE.md](docs/PRESENTATION_GUIDE.md)

## Prerequisites

- Node.js 20+
- Gemini API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your `.env` file with your Gemini key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start the app:

```bash
npm run dev
```

The frontend runs on the Vite default port and proxies API calls to the Node backend.

## Output

The API now returns:

- The main summary
- Cognitive drift analysis
- Perspective-based summaries and comparative insights
