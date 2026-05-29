export const UAS_QUESTIONS = [
  {
    id: "map-bind",
    answer: "Bind",
    points: 10,
  },
  {
    id: "sage-ulti",
    answer: "Resurrection",
    points: 10,
  },
  {
    id: "omen-skill-name",
    answer: "Dark Cover",
    points: 10,
  },
  {
    id: "weapon-vandal",
    answer: "Vandal",
    points: 10,
  },
  {
    id: "trailblazer-owner",
    answer: "Skye",
    points: 10,
  },
  {
    id: "skin-prime",
    answer: "Prime Vandal",
    points: 10,
  },
  {
    id: "voice-chamber",
    answer: "Chamber",
    points: 10,
  },
  {
    id: "blend-yoru",
    answer: "Yoru",
    points: 25,
  },
  {
    id: "blend-clove",
    answer: "Clove",
    points: 25,
  },
  {
    id: "blend-gekko",
    answer: "Gekko",
    points: 25,
  },
];

export const UAS_MAX_RAW_SCORE = UAS_QUESTIONS.reduce(
  (total, question) => total + question.points,
  0,
);

export function getRank(score) {
  if (score >= 100) return "Radiant";
  if (score >= 95) return "Immortal";
  if (score >= 90) return "Ascendant";
  if (score >= 80) return "Diamond";
  if (score >= 70) return "Platinum";
  if (score >= 60) return "Gold";
  if (score >= 45) return "Silver";
  if (score >= 30) return "Bronze";
  return "Iron";
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function gradeUasAnswers(answers) {
  const safeAnswers = answers && typeof answers === "object" ? answers : {};
  let rawScore = 0;

  const detail = UAS_QUESTIONS.map((question) => {
    const submitted = safeAnswers[question.id];
    const isCorrect =
      normalizeAnswer(submitted) === normalizeAnswer(question.answer);

    if (isCorrect) {
      rawScore += question.points;
    }

    return {
      id: question.id,
      answer: submitted || "",
      correctAnswer: question.answer,
      correct: isCorrect,
      points: isCorrect ? question.points : 0,
      maxPoints: question.points,
    };
  });

  const score = Math.round((rawScore / UAS_MAX_RAW_SCORE) * 100);

  return {
    detail,
    maxRawScore: UAS_MAX_RAW_SCORE,
    rank: getRank(score),
    rawScore,
    score,
  };
}
