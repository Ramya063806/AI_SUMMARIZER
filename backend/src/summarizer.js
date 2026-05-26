import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function buildPrompt(content, options) {
  const styleInstruction =
    options.style === "bullet"
      ? "Return the summary as bullet points, one point per line."
      : "Return the summary as a single paragraph.";
  const toneInstruction =
    options.tone === "formal"
      ? "Use a formal tone."
      : options.tone === "direct"
        ? "Use a direct, concise tone."
        : "Use a neutral tone.";

  const lengthInstruction =
    options.summaryLength === "short"
      ? "Keep it very short, around 3 to 5 key points or 2 to 4 sentences."
      : options.summaryLength === "long"
        ? "Keep it moderately detailed, around 6 to 8 key points or 5 to 7 sentences."
        : "Keep it medium length, around 4 to 6 key points or 3 to 5 sentences.";

  const modeInstruction =
    options.mode === "abstractive"
      ? "Write an abstractive summary that rewrites the ideas naturally while preserving meaning."
      : "Write an extractive summary that stays close to the original wording and sentence flow.";

  return [
    "Summarize the content below.",
    modeInstruction,
    lengthInstruction,
    styleInstruction,
    toneInstruction,
    "Do not add any information that is not present in the content.",
    "Do not include headings, labels, or explanations.",
    "Preserve the original meaning, key ideas, and logical flow.",
    "Content:",
    content,
  ].join("\n\n");
}

function cleanGeminiText(text) {
  return text
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function summarizeContent(content, options) {
  const text = content.replace(/\s+/g, " ").trim();

  if (!text) {
    return "";
  }

  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(buildPrompt(text, options));
  const response = await result.response;
  const summary = response.text();

  return cleanGeminiText(summary);
}
