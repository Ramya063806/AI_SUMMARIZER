import "dotenv/config";
import cors from "cors";
import express from "express";
import multer from "multer";
import { analyzeCognitiveDrift } from "./cognitiveDrift.js";
import { extractContentFromUpload, extractContentFromUrl } from "./content.js";
import { generatePerspectiveSummaries } from "./perspectiveEngine.js";
import { summarizeContent } from "./summarizer.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_, response) => {
  response.json({ ok: true });
});

app.post("/api/summarize", upload.single("file"), async (request, response) => {
  try {
    const mode =
      request.body.mode === "abstractive" ? "abstractive" : "extractive";
    const summaryLength = ["short", "medium", "long"].includes(
      request.body.summaryLength,
    )
      ? request.body.summaryLength
      : "medium";
    const style = request.body.style === "bullet" ? "bullet" : "paragraph";
    const tone = ["neutral", "formal", "direct"].includes(request.body.tone)
      ? request.body.tone
      : "neutral";

    let content = (request.body.content ?? "").trim();

    if (request.file) {
      content = await extractContentFromUpload(request.file);
    } else if (request.body.url?.trim()) {
      content = await extractContentFromUrl(request.body.url.trim());
    }

    if (!content) {
      response.status(400).json({ error: "Provide text, a file, or a URL." });
      return;
    }

    const driftAnalysis = analyzeCognitiveDrift(content);
    const perspectiveAnalysis = generatePerspectiveSummaries(content);

    const summarizedContent = await summarizeContent(content, {
      mode,
      summaryLength,
      style,
      tone,
    });

    response.json({
      summarizedContent,
      originalContent: content,
      driftAnalysis,
      perspectiveAnalysis,
    });
  } catch (error) {
    response
      .status(400)
      .json({ error: error.message ?? "Unable to summarize the content." });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
