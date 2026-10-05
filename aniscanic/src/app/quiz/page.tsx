'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Brain, Star, Trophy, Check, X, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { cn } from '@/lib/utils';
import { getAnimeQuiz, type Difficulty, type QuizQuestion } from '@/lib/api/opentdb';

const QUESTION_COUNT = 10;

const levels: { difficulty: Difficulty; title: string; label: string; image: string }[] = [
  {
    difficulty: 'easy',
    title: 'Pour bien commencer',
    label: 'Facile',
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    difficulty: 'medium',
    title: 'Fan confirmé',
    label: 'Intermédiaire',
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
  },
  {
    difficulty: 'hard',
    title: 'Expert otaku',
    label: 'Difficile',
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
  },
];

type Game =
  | { status: 'idle' }
  | { status: 'loading'; level: Difficulty }
  | { status: 'error'; level: Difficulty; message: string }
  | { status: 'playing'; level: Difficulty; questions: QuizQuestion[]; index: number; score: number; picked: string | null }
  | { status: 'done'; level: Difficulty; total: number; score: number };

function Quiz() {
  const [game, setGame] = useState<Game>({ status: 'idle' });
  const levelLabel = (d: Difficulty) => levels.find((l) => l.difficulty === d)!.label;

  async function start(level: Difficulty) {
    setGame({ status: 'loading', level });
    try {
      const questions = await getAnimeQuiz(level, QUESTION_COUNT);
      setGame({ status: 'playing', level, questions, index: 0, score: 0, picked: null });
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
      setGame({ status: 'done', level: game.level, total: game.questions.length, score: game.score });
    } else {
      setGame({ ...game, index: game.index + 1, picked: null });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Quiz Manga"
        subtitle="Testez vos connaissances et défiez d'autres fans"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {game.status === 'idle' || game.status === 'loading' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {levels.map((level) => {
                const loading = game.status === 'loading' && game.level === level.difficulty;
                return (
                  <div key={level.difficulty} className="bg-card rounded-2xl shadow-card overflow-hidden">
                    <div className="relative h-[200px]">
                      <Image src={level.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-bold text-white mb-2">{level.title}</h2>
                        <div className="flex items-center gap-4 text-white/90">
                          <span className="flex items-center gap-1"><Star size={16} aria-hidden />{level.label}</span>
                          <span className="flex items-center gap-1"><Brain size={16} aria-hidden />{QUESTION_COUNT} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <button
                        type="button"
                        onClick={() => start(level.difficulty)}
                        disabled={game.status === 'loading'}
                        className="w-full bg-brand-red text-white py-3 rounded-full hover:bg-brand-gold hover:text-brand-dark transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                      >
                        {loading ? 'Chargement des questions…' : 'Commencer le quiz'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Questions fournies par{' '}
              <a href="https://opentdb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-red">Open Trivia DB</a>{' '}
              (en anglais), tirées au hasard à chaque partie.
            </p>
          </>
        ) : (
          <section className="max-w-2xl mx-auto bg-card rounded-2xl shadow-card p-6 md:p-10" aria-live="polite">
            {game.status === 'error' && (
              <div className="flex flex-col items-start gap-6">
                <p className="text-lg">{game.message}</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => start(game.level)} className="px-6 py-3 rounded-full bg-brand-red text-white hover:bg-brand-gold hover:text-brand-dark transition-colors">Réessayer</button>
                  <button type="button" onClick={() => setGame({ status: 'idle' })} className="px-6 py-3 rounded-full bg-muted hover:bg-brand-gold hover:text-brand-dark transition-colors">Changer de niveau</button>
                </div>
              </div>
            )}

            {game.status === 'playing' && (() => {
              const q = game.questions[game.index];
              return (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Question {game.index + 1} sur {game.questions.length}</span>
                    <span className="flex items-center gap-3">
                      {levelLabel(game.level)} – {game.score} point{game.score > 1 ? 's' : ''}
                      <button
                        type="button"
                        onClick={() => setGame({ status: 'idle' })}
                        className="rounded-full px-3 py-1 bg-muted text-foreground hover:bg-brand-gold hover:text-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                      >
                        Quitter
                      </button>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden" aria-hidden>
                    <div className="h-full bg-brand-red transition-all" style={{ width: `${(game.index / game.questions.length) * 100}%` }} />
                  </div>
                  <h2 lang="en" className="text-xl md:text-2xl font-bold leading-snug">{q.question}</h2>
                  <ul className="flex flex-col gap-3">
                    {q.answers.map((answer) => {
                      const isCorrect = answer === q.correct;
                      const isPicked = answer === game.picked;
                      return (
                        <li key={answer}>
                          <button
                            type="button"
                            lang="en"
                            onClick={() => pick(answer)}
                            disabled={game.picked !== null}
                            className={cn(
                              'w-full flex items-center justify-between gap-3 text-left rounded-xl px-5 py-4 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red',
                              game.picked === null && 'bg-muted hover:bg-brand-gold hover:text-brand-dark',
                              game.picked !== null && isCorrect && 'bg-emerald-700 text-white',
                              game.picked !== null && isPicked && !isCorrect && 'bg-brand-red text-brand-dark',
                              game.picked !== null && !isCorrect && !isPicked && 'bg-muted opacity-60'
                            )}
                          >
                            {answer}
                            {game.picked !== null && isCorrect && <Check size={20} aria-label="Bonne réponse" />}
                            {isPicked && !isCorrect && <X size={20} aria-label="Ta réponse, incorrecte" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {game.picked !== null && (
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold">
                        {game.picked === q.correct ? 'Bonne réponse !' : <>Raté. La bonne réponse était <span lang="en">« {q.correct} »</span>.</>}
                      </p>
                      <button
                        type="button"
                        onClick={nextQuestion}
                        autoFocus
                        className="shrink-0 px-6 py-3 rounded-full bg-brand-red text-white hover:bg-brand-gold hover:text-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                      >
                        {game.index + 1 >= game.questions.length ? 'Voir mon score' : 'Question suivante'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {game.status === 'done' && (
              <div className="flex flex-col items-center gap-6 text-center">
                <Trophy className="text-brand-gold" size={48} aria-hidden />
                <h2 className="text-3xl font-bold">{game.score} / {game.total}</h2>
                <p className="text-muted-foreground">
                  {game.score === game.total
                    ? 'Sans faute. Essaie le niveau au-dessus !'
                    : game.score >= game.total / 2
                      ? 'Joli score. Une autre partie pour faire mieux ?'
                      : 'Chaque partie tire de nouvelles questions : retente ta chance.'}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => start(game.level)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-red text-white hover:bg-brand-gold hover:text-brand-dark transition-colors">
                    <RotateCcw size={18} aria-hidden /> Rejouer ({levelLabel(game.level)})
                  </button>
                  <button type="button" onClick={() => setGame({ status: 'idle' })} className="px-6 py-3 rounded-full bg-muted hover:bg-brand-gold hover:text-brand-dark transition-colors">
                    Changer de niveau
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Leaderboard Preview */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Meilleurs Scores</h2>
            <Trophy className="text-brand-gold" size={32} />
          </div>
          <div className="space-y-4">
            {[
              { name: "Luffy_Fan", score: 980, rank: 1 },
              { name: "MangaKing", score: 850, rank: 2 },
              { name: "OtakuPro", score: 720, rank: 3 }
            ].map((player, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">{player.rank}</span>
                  <span>{player.name}</span>
                </div>
                <span className="font-bold text-brand-red">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
