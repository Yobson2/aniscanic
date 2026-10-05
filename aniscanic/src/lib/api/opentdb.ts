// Open Trivia DB - free, no key, CORS enabled. Category 31 = "Entertainment: Japanese Anime & Manga".
// Questions are in English. Limit: 1 request every 5 seconds per IP.
// https://opentdb.com/api_config.php

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  question: string;
  answers: string[];
  correct: string;
}

const ERRORS: Record<number, string> = {
  1: "Pas assez de questions disponibles pour ce niveau. Choisis un autre niveau.",
  5: 'Trop de demandes rapprochées. Patiente 5 secondes puis relance le quiz.',
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** How many anime & manga questions the pool holds, per difficulty. Separate endpoint, not rate limited. */
export async function getQuestionCounts(): Promise<Record<Difficulty | 'total', number>> {
  const res = await fetch('https://opentdb.com/api_count.php?category=31', { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`OpenTDB ${res.status}`);
  const { category_question_count: c } = (await res.json()) as {
    category_question_count: Record<string, number>;
  };
  return {
    total: c.total_question_count,
    easy: c.total_easy_question_count,
    medium: c.total_medium_question_count,
    hard: c.total_hard_question_count,
  };
}

export async function getAnimeQuiz(difficulty: Difficulty, amount = 10): Promise<QuizQuestion[]> {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=31&type=multiple&difficulty=${difficulty}&encode=url3986`
  );
  // The rate limit comes back as HTTP 429 (not only as response_code 5 like the docs say).
  if (res.status === 429) throw new Error(ERRORS[5]);
  if (!res.ok) throw new Error('Le service de quiz ne répond pas. Réessaie dans un instant.');
  const json = (await res.json()) as {
    response_code: number;
    results: { question: string; correct_answer: string; incorrect_answers: string[] }[];
  };
  if (json.response_code !== 0) {
    throw new Error(ERRORS[json.response_code] ?? 'Impossible de charger les questions. Réessaie.');
  }
  return json.results.map((q) => {
    const correct = decodeURIComponent(q.correct_answer);
    return {
      question: decodeURIComponent(q.question),
      correct,
      answers: shuffle([correct, ...q.incorrect_answers.map(decodeURIComponent)]),
    };
  });
}
