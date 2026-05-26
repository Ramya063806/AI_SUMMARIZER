import {
  clamp,
  normalizeText,
  scoreByKeywords,
  splitSentences,
} from "./nlp.js";

const PERSPECTIVE_PROFILES = {
  business: {
    label: "Business View",
    keywords: [
      "growth",
      "revenue",
      "roi",
      "value",
      "market",
      "impact",
      "strategy",
      "customer",
      "efficiency",
      "opportunity",
    ],
    priorities: ["ROI", "growth", "opportunities", "impact"],
  },
  student: {
    label: "Student View",
    keywords: [
      "simple",
      "learn",
      "understand",
      "example",
      "basic",
      "concept",
      "step",
      "clear",
      "help",
      "easy",
    ],
    priorities: ["simplicity", "learning concepts", "easy understanding"],
  },
  researcher: {
    label: "Researcher View",
    keywords: [
      "evidence",
      "method",
      "methodology",
      "data",
      "study",
      "analysis",
      "result",
      "sample",
      "finding",
      "quality",
    ],
    priorities: ["evidence", "methodology", "data quality"],
  },
  critic: {
    label: "Critic View",
    keywords: [
      "weak",
      "contradiction",
      "missing",
      "gap",
      "assumption",
      "issue",
      "limit",
      "flaw",
      "risk",
      "inconsistent",
    ],
    priorities: ["weak logic", "contradictions", "missing arguments"],
  },
};

function pickSentencesForPerspective(sentences, keywords) {
  const ranked = sentences.map((sentence, index) => {
    const keywordScore = scoreByKeywords(sentence, keywords);
    const sentenceWeight = clamp(10 - index, 1, 10);
    return {
      sentence,
      score: keywordScore * 3 + sentenceWeight,
    };
  });

  ranked.sort((left, right) => right.score - left.score);
  return ranked
    .slice(0, Math.max(2, Math.min(4, Math.ceil(sentences.length * 0.3))))
    .map((item) => item.sentence);
}

function buildPerspectiveSummary(sentences, keywords) {
  const selected = pickSentencesForPerspective(sentences, keywords);
  return selected.length ? selected.join(" ") : sentences.slice(0, 2).join(" ");
}

function buildComparativeInsights(perspectives) {
  const summaries = Object.values(perspectives).map((item) => item.summary);
  const commonLength =
    summaries.reduce((total, summary) => total + summary.length, 0) /
    summaries.length;

  return [
    "The business view prioritizes practical impact and value creation.",
    "The student view simplifies the content for comprehension and learning.",
    "The researcher view emphasizes evidence and methodological quality.",
    "The critic view highlights gaps, contradictions, and weak reasoning.",
    `The perspectives stay aligned to the source material while framing it differently, with an average summary length of ${Math.round(commonLength)} characters.`,
  ];
}

function buildDifferenceAnalysis(perspectives) {
  return [
    {
      label: "Business vs Student",
      insight:
        "The business view emphasizes outcome and value, while the student view lowers complexity and focuses on learning.",
    },
    {
      label: "Researcher vs Critic",
      insight:
        "The researcher view seeks evidence and structure, while the critic view probes weaknesses and missing logic.",
    },
    {
      label: "Shared Ground",
      insight:
        "All perspectives preserve the core context of the source and differ mainly in emphasis, not in facts.",
    },
  ];
}

export function generatePerspectiveSummaries(content) {
  const text = normalizeText(content);
  const sentences = splitSentences(text);

  if (!sentences.length) {
    return {
      perspectives: {},
      comparativeInsights: [],
      differenceAnalysis: [],
    };
  }

  const perspectives = Object.fromEntries(
    Object.entries(PERSPECTIVE_PROFILES).map(([key, profile]) => {
      const summary = buildPerspectiveSummary(sentences, profile.keywords);
      return [
        key,
        {
          label: profile.label,
          summary,
          priorities: profile.priorities,
          sourceTrace: summary.slice(0, 220),
        },
      ];
    }),
  );

  return {
    perspectives,
    comparativeInsights: buildComparativeInsights(perspectives),
    differenceAnalysis: buildDifferenceAnalysis(perspectives),
  };
}
