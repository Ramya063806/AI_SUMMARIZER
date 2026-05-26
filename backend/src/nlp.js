const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "with",
  "would",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);

export function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function tokenizeWords(text) {
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

export function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

export function removeStopWords(words) {
  return words.filter((word) => !STOP_WORDS.has(word));
}

export function uniqueWords(text) {
  return Array.from(new Set(removeStopWords(tokenizeWords(text))));
}

export function chunkSentences(sentences, chunkSize = 3) {
  const chunks = [];

  for (let index = 0; index < sentences.length; index += chunkSize) {
    chunks.push(sentences.slice(index, index + chunkSize));
  }

  return chunks;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function scoreByKeywords(text, keywords) {
  const words = tokenizeWords(text);
  let score = 0;

  for (const keyword of keywords) {
    if (words.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

export function overlapScore(leftText, rightText) {
  const leftWords = new Set(uniqueWords(leftText));
  const rightWords = new Set(uniqueWords(rightText));

  if (!leftWords.size || !rightWords.size) {
    return 0;
  }

  let overlap = 0;
  for (const word of leftWords) {
    if (rightWords.has(word)) {
      overlap += 1;
    }
  }

  return overlap / Math.min(leftWords.size, rightWords.size);
}
