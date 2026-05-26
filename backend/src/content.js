import * as cheerio from "cheerio";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

function readTextBuffer(buffer) {
  return buffer.toString("utf8").trim();
}

export async function extractContentFromUpload(file) {
  const filename = (file.originalname ?? "").toLowerCase();
  const mimetype = (file.mimetype ?? "").toLowerCase();

  if (mimetype.includes("pdf") || filename.endsWith(".pdf")) {
    const parsed = await pdfParse(file.buffer);
    return parsed.text.trim();
  }

  if (mimetype.includes("word") || filename.endsWith(".docx")) {
    const extracted = await mammoth.extractRawText({ buffer: file.buffer });
    return extracted.value.trim();
  }

  if (mimetype.startsWith("text/") || filename.endsWith(".txt")) {
    return readTextBuffer(file.buffer);
  }

  throw new Error("Unsupported file type. Use TXT, DOCX, or PDF.");
}

export async function extractContentFromUrl(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "AI Content Summarizer",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch the provided URL.");
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, noscript").remove();

  const text = $("body").text().replace(/\s+/g, " ").trim();
  if (!text) {
    throw new Error("The URL did not contain readable text.");
  }

  return text;
}
