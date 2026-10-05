// Personal quiz records, kept in this browser only (there are no accounts).

import type { Difficulty } from '@/lib/api/opentdb';

export interface QuizRecord {
  best: number;
  total: number;
  played: number;
  lastPlayedAt: string;
}

export type QuizRecords = Partial<Record<Difficulty, QuizRecord>>;

const KEY = 'aniscanic-quiz-records';

export function readRecords(): QuizRecords {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as QuizRecords;
  } catch {
    return {};
  }
}

/** Saves a finished game and returns the updated records, plus whether it beat the previous best. */
export function saveGame(level: Difficulty, score: number, total: number) {
  const records = readRecords();
  const previous = records[level];
  const isBest = !previous || score > previous.best;
  records[level] = {
    best: isBest ? score : previous.best,
    total,
    played: (previous?.played ?? 0) + 1,
    lastPlayedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    // Storage unavailable (private mode): the game still works, the record just isn't kept.
  }
  return { records, isBest: isBest && !!previous };
}
