import {
  clamp,
  chunkSentences,
  normalizeText,
  overlapScore,
  scoreByKeywords,
  splitSentences,
  uniqueWords,
} from "./nlp.js";

const INTENT_PROFILES = {
  informative: [
    "explain",
    "describe",
    "inform",
    "detail",
    "report",
    "shows",
    "states",
    "highlights",
    "notes",
  ],
  persuasive: [
    "should",
    "must",
    "need",
    "best",
    "benefit",
    "improve",
    "recommend",
    "convince",
    "opportunity",
  ],
  analytical: [
    "analyze",
    "analysis",
    "evidence",
    "data",
    "method",
    "result",
    "compare",
    "measure",
    "evaluate",
  ],
  defensive: [
    "however",
    "although",
    "despite",
    "issue",
    "concern",
    "risk",
    "limit",
    "defend",
    "counter",
  ],
  emotional: [
    "feels",
    "feel",
    "fear",
    "hope",
    "urgent",
    "worried",
    "excited",
    "frustrated",
    "angry",
    "concerned",
  ],
};

const POSITIVE_WORDS = [
  "good",
  "great",
  "positive",
  "success",
  "benefit",
  "growth",
  "improve",
  "effective",
  "strong",
  "confident",
];
const NEGATIVE_WORDS = [
  "bad",
  "risk",
  "weak",
  "loss",
  "problem",
  "issue",
  "uncertain",
  "decline",
  "negative",
  "failure",
];

function scoreIntent(text) {
  const scores = Object.entries(INTENT_PROFILES).map(([label, keywords]) => ({
    label,
    score: scoreByKeywords(text, keywords),
  }));

  scores.sort((left, right) => right.score - left.score);
  return scores[0]?.score ? scores[0].label : "informative";
}

function scoreEmotion(text) {
  const positive = scoreByKeywords(text, POSITIVE_WORDS);
  const negative = scoreByKeywords(text, NEGATIVE_WORDS);
  const net = positive - negative;

  if (net > 1) {
    return { label: "positive", score: net };
  }

  if (net < -1) {
    return { label: "negative", score: net };
  }

  return { label: "neutral", score: net };
}

function buildChunkSummary(chunkSentencesList) {
  return normalizeText(chunkSentencesList.join(" "));
}

function buildIndicators(intent, emotion, stabilityScore, overlap) {
  const indicators = [];

  if (stabilityScore < 70) {
    indicators.push("context shift");
  }

  if (emotion.label !== "neutral") {
    indicators.push(`${emotion.label} emotion`);
  }

  if (overlap < 0.25) {
    indicators.push("low lexical overlap");
  }

  indicators.push(`intent: ${intent}`);
  return indicators;
}

export function analyzeCognitiveDrift(content) {
  const text = normalizeText(content);
  const sentences = splitSentences(text);

  if (!sentences.length) {
    return {
      stabilityPercentage: 100,
      confidenceScore: 0,
      driftIndicators: [],
      intentShiftTimeline: [],
      emotionalTransitionSummary: "No analyzable content was provided.",
      narrativeDriftReport: "No analyzable content was provided.",
      contextConsistencyAnalysis: "No analyzable content was provided.",
      semanticChunks: [],
    };
  }

  const chunkSize = sentences.length > 12 ? 3 : 2;
  const chunkGroups = chunkSentences(sentences, chunkSize);
  const chunks = chunkGroups.map((group, index) => {
    const chunkText = buildChunkSummary(group);
    const intent = scoreIntent(chunkText);
    const emotion = scoreEmotion(chunkText);
    const traceText = uniqueWords(chunkText).slice(0, 14).join(" ");

    return {
      index: index + 1,
      text: chunkText,
      sentenceCount: group.length,
      intent,
      emotion: emotion.label,
      emotionScore: emotion.score,
      trace: traceText,
    };
  });

  const timeline = chunks.map((chunk, index) => {
    const previous = chunks[index - 1];
    const overlap = previous
      ? overlapScore(previous.text, chunk.text)
      : overlapScore(chunks[0].text, chunk.text);
    const intentChanged = previous ? previous.intent !== chunk.intent : false;
    const emotionChanged = previous
      ? previous.emotion !== chunk.emotion
      : false;

    const stabilityScore = clamp(
      Math.round(
        100 -
          (1 - overlap) * 50 -
          (intentChanged ? 20 : 0) -
          (emotionChanged ? 15 : 0),
      ),
      0,
      100,
    );

    const driftScore = 100 - stabilityScore;

    return {
      section: chunk.index,
      excerpt: chunk.text.slice(0, 180),
      intentLabel: chunk.intent,
      emotionLabel: chunk.emotion,
      stabilityScore,
      driftScore,
      driftFlags: buildIndicators(
        chunk.intent,
        { label: chunk.emotion },
        stabilityScore,
        overlap,
      ),
    };
  });

  const averageStability =
    timeline.reduce((total, item) => total + item.stabilityScore, 0) /
    timeline.length;
  const stabilityPercentage = Math.round(averageStability);
  const confidenceScore = clamp(
    Math.round(
      55 +
        Math.min(chunks.length, 10) * 4 +
        Math.min(sentences.length, 20) * 1.2,
    ),
    0,
    100,
  );
  const driftIndicators = Array.from(
    new Set(timeline.flatMap((item) => item.driftFlags)),
  ).slice(0, 8);

  const firstChunk = chunks[0];
  const middleChunk = chunks[Math.floor((chunks.length - 1) / 2)];
  const finalChunk = chunks[chunks.length - 1];

  const middleOverlap = overlapScore(firstChunk.text, middleChunk.text);
  const finalOverlap = overlapScore(firstChunk.text, finalChunk.text);

  const narrativeDriftReport =
    stabilityPercentage >= 80
      ? `The narrative stays largely consistent from the opening section to the conclusion. The strongest alignment is between the opening and closing sections with an overlap score of ${finalOverlap.toFixed(2)}.`
      : `The narrative shifts across sections. The opening, middle, and closing chunks show uneven alignment, with the opening-to-middle overlap at ${middleOverlap.toFixed(2)} and opening-to-final overlap at ${finalOverlap.toFixed(2)}.`;

  const contextConsistencyAnalysis =
    stabilityPercentage >= 75
      ? "Context remains mostly stable, with the document keeping its core topic and direction intact across sections."
      : "Context consistency weakens in later sections, showing topic movement, intent shifts, or inconsistent emphasis.";

  const emotionalTransitionSummary = timeline
    .map(
      (item) =>
        `Section ${item.section}: ${item.emotionLabel} tone with ${item.intentLabel} intent.`,
    )
    .join(" ");

  return {
    stabilityPercentage,
    confidenceScore,
    driftIndicators,
    intentShiftTimeline: timeline,
    emotionalTransitionSummary,
    narrativeDriftReport,
    contextConsistencyAnalysis,
    semanticChunks: chunks,
  };
}
