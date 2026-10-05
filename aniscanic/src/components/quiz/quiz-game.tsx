'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAnimeQuiz, type Difficulty, type QuizQuestion } from '@/lib/api/opentdb';
import { readRecords, saveGame, type QuizRecords } from '@/lib/quiz-records';

const QUESTION_COUNT = 10;

const levels: { difficulty: Difficulty; label: string; description: string; strength: number }[] = [
  { difficulty: 'easy', label: 'Facile', description: 'Pour s’échauffer.', strength: 1 },
  { difficulty: 'medium', label: 'Intermédiaire', description: 'Pour les fans réguliers.', strength: 2 },
  { difficulty: 'hard', label: 'Difficile', description: 'Pour les connaisseurs les plus pointus.', strength: 3 },
];

const levelLabel = (d: Difficulty) => levels.find((l) => l.difficulty === d)!.label;

type Game =
  | { status: 'idle' }
  | { status: 'loading'; level: Difficulty }
  | { status: 'error'; level: Difficulty; message: string }
  | { status: 'playing'; level: Difficulty; questions: QuizQuestion[]; index: number; score: number; picked: string | null }
  | { status: 'done'; level: Difficulty; total: number; score: number; newBest: boolean };

const primaryButton =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 font-semibold text-brand-dark transition-colors hover:bg-brand-gold disabled:opacity-60';
const quietButton =
  'inline-flex h-12 items-center justify-center rounded-xl bg-muted px-6 font-semibold transition-colors hover:bg-brand-gold hover:text-brand-dark';

/** Three bars, filled up to the level's strength */
function DifficultyMeter({ strength }: { strength: number }) {
  return (
    <span aria-hidden className="flex items-end gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn('w-2 rounded-full', n <= strength ? 'bg-brand-red' : 'bg-muted')}
          style={{ height: `${n * 0.5 + 0.5}rem` }}
        />
      ))}
    </span>
  );
}

export default function QuizGame({ counts }: { counts: Record<Difficulty, number> | null }) {
  const [game, setGame] = useState<Game>({ status: 'idle' });
  const [records, setRecords] = useState<QuizRecords>({});
  const panel = useRef<HTMLElement>(null);

  useEffect(() => setRecords(readRecords()), []);

  // Keyboard play: 1–4 picks an answer
  useEffect(() => {
    if (game.status !== 'playing' || game.picked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const answer = game.questions[game.index].answers[Number(e.key) - 1];
      if (answer) pick(answer);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  async function start(level: Difficulty) {
    setGame({ status: 'loading', level });
    try {
      const questions = await getAnimeQuiz(level, QUESTION_COUNT);
      setGame({ status: 'playing', level, questions, index: 0, score: 0, picked: null });
      panel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } catch (e) {
      setGame({ status: 'error', level, message: (e as Error).message });
    }
  }

  function pick(answer: string) {
    if (game.status !== 'playing' || game.picked) return;
    const correct = answer === game.questions[game.index].correct;
    setGame({ ...game, picked: answer, score: game.score + (correct ? 1 : 0) });
  }

  function nextQuestion() {
    if (game.status !== 'playing') return;
    if (game.index + 1 >= game.questions.length) {
      const saved = saveGame(game.level, game.score, game.questions.length);
      setRecords(saved.records);
      setGame({ status: 'done', level: game.level, total: game.questions.length, score: game.score, newBest: saved.isBest });
    } else {
      setGame({ ...game, index: game.index + 1, picked: null });
    }
  }

  const choosing = game.status === 'idle' || game.status === 'loading';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      {choosing ? (
        <section aria-labelledby="levels-title">
          <h2 id="levels-title" className="type-title mb-8 text-2xl md:text-3xl">Choisis ton niveau</h2>
          <ul className="grid gap-gutter md:grid-cols-3">
            {levels.map((level) => {
              const loading = game.status === 'loading' && game.level === level.difficulty;
              const record = records[level.difficulty];
              return (
                <li key={level.difficulty} className="flex flex-col gap-5 rounded-xl bg-card p-6 shadow-card md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="type-title text-2xl">{level.label}</h3>
                    <DifficultyMeter strength={level.strength} />
                  </div>
                  <p className="text-muted-foreground">{level.description}</p>
                  <dl className="mt-auto grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-muted/60 px-3 py-2">
                      <dt className="text-muted-foreground">Questions en réserve</dt>
                      <dd className="text-lg font-semibold">{counts ? counts[level.difficulty] : '—'}</dd>
                    </div>
                    <div className="rounded-lg bg-muted/60 px-3 py-2">
                      <dt className="text-muted-foreground">Ton record</dt>
                      <dd className="text-lg font-semibold">{record ? `${record.best} / ${record.total}` : 'Pas encore joué'}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => start(level.difficulty)}
                    disabled={game.status === 'loading'}
                    className={primaryButton}
                  >
                    {loading ? 'Chargement des questions…' : `Jouer en ${level.label.toLowerCase()}`}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            {QUESTION_COUNT} questions par partie, tirées au hasard dans{' '}
            <a href="https://opentdb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-text">
              Open Trivia DB
            </a>
            . Les questions sont en anglais. Tes records restent sur cet appareil.
          </p>
        </section>
      ) : (
        <section ref={panel} aria-live="polite" className="mx-auto max-w-2xl scroll-mt-28 rounded-xl bg-card p-6 shadow-card md:p-10">
          {game.status === 'error' && (
            <div className="flex flex-col items-start gap-6">
              <h2 className="type-title text-2xl">La partie n’a pas pu démarrer</h2>
              <p className="text-muted-foreground">{game.message}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => start(game.level)} className={primaryButton}>Réessayer</button>
                <button type="button" onClick={() => setGame({ status: 'idle' })} className={quietButton}>Changer de niveau</button>
              </div>
            </div>
          )}

          {game.status === 'playing' && (() => {
            const q = game.questions[game.index];
            return (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                  <span>
                    Question {game.index + 1} sur {game.questions.length}, {levelLabel(game.level).toLowerCase()}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      {game.score} point{game.score > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGame({ status: 'idle' })}
                      className="inline-flex min-h-11 items-center rounded-lg px-3 hover:bg-muted"
                    >
                      Quitter
                    </button>
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Progression"
                  aria-valuemin={0}
                  aria-valuemax={game.questions.length}
                  aria-valuenow={game.index}
                  className="h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div className="h-full rounded-full bg-brand-red transition-[width] duration-300" style={{ width: `${(game.index / game.questions.length) * 100}%` }} />
                </div>
                <h2 lang="en" className="text-xl font-semibold leading-snug md:text-2xl">{q.question}</h2>
                <ul className="flex flex-col gap-2">
                  {q.answers.map((answer, i) => {
                    const isCorrect = answer === q.correct;
                    const isPicked = answer === game.picked;
                    const revealed = game.picked !== null;
                    return (
                      <li key={answer}>
                        <button
                          type="button"
                          onClick={() => pick(answer)}
                          disabled={revealed}
                          aria-keyshortcuts={String(i + 1)}
                          className={cn(
                            'flex min-h-14 w-full items-center gap-4 rounded-xl px-4 py-3 text-left font-medium transition-colors',
                            !revealed && 'bg-muted hover:bg-brand-gold hover:text-brand-dark',
                            revealed && isCorrect && 'bg-emerald-700 text-white',
                            revealed && isPicked && !isCorrect && 'bg-brand-red text-brand-dark',
                            revealed && !isCorrect && !isPicked && 'bg-muted opacity-60'
                          )}
                        >
                          <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background/60 text-sm font-semibold text-foreground">
                            {i + 1}
                          </span>
                          <span lang="en" className="flex-1">{answer}</span>
                          {revealed && isCorrect && <Check size={20} aria-label="Bonne réponse" />}
                          {isPicked && !isCorrect && <X size={20} aria-label="Ta réponse, incorrecte" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {game.picked !== null ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold">
                      {game.picked === q.correct ? 'Bonne réponse.' : <>Raté. La bonne réponse était <span lang="en">« {q.correct} »</span>.</>}
                    </p>
                    <button type="button" onClick={nextQuestion} autoFocus className={cn(primaryButton, 'shrink-0')}>
                      {game.index + 1 >= game.questions.length ? 'Voir mon score' : 'Question suivante'}
                    </button>
                  </div>
                ) : (
                  <p className="hidden text-sm text-muted-foreground md:block">Astuce : réponds avec les touches 1 à 4.</p>
                )}
              </div>
            );
          })()}

          {game.status === 'done' && (
            <div className="flex flex-col items-center gap-5 text-center">
              <Trophy className="text-brand-gold" size={48} aria-hidden />
              <h2 className="type-display text-5xl">{game.score} / {game.total}</h2>
              <p className="text-muted-foreground">
                {game.newBest
                  ? `Nouveau record en ${levelLabel(game.level).toLowerCase()}.`
                  : game.score === game.total
                    ? 'Sans faute. Essaie le niveau au-dessus.'
                    : 'Chaque partie tire de nouvelles questions : retente ta chance.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => start(game.level)} className={primaryButton}>
                  <RotateCcw size={18} aria-hidden /> Rejouer en {levelLabel(game.level).toLowerCase()}
                </button>
                <button type="button" onClick={() => setGame({ status: 'idle' })} className={quietButton}>
                  Changer de niveau
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
