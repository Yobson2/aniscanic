'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Clock, ExternalLink } from 'lucide-react';
import type { AnimeMovie } from '@/lib/api/anilist';

export default function MovieCard({ movie, featured = false }: { movie: AnimeMovie; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);

  const details = [movie.year, movie.studio, ...movie.genres].filter(Boolean).join(' – ');

  return (
    <article className="bg-card rounded-xl shadow-card overflow-hidden h-full">
      <div className={featured ? "relative aspect-video md:aspect-[21/9] bg-brand-dark" : "relative aspect-video bg-brand-dark"}>
        {playing && movie.youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${movie.youtubeId}?autoplay=1&rel=0`}
            title={`Bande-annonce de ${movie.title}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <Image
              src={movie.image}
              alt=""
              fill
              sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
              priority={featured}
              className="object-cover"
            />
            {movie.youtubeId ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 flex items-center justify-center bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors focus-visible:outline-offset-[-6px]"
              >
                <span className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-3 font-semibold text-brand-dark group-hover:bg-brand-gold transition-colors">
                  <Play size={20} aria-hidden fill="currentColor" />
                  Voir la bande-annonce
                </span>
                <span className="sr-only">de {movie.title}</span>
              </button>
            ) : null}
            {movie.durationMinutes && (
              <span className="absolute bottom-4 right-4 bg-brand-dark/80 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
                <Clock size={14} aria-hidden />
                {Math.floor(movie.durationMinutes / 60)} h {String(movie.durationMinutes % 60).padStart(2, '0')}
              </span>
            )}
          </>
        )}
      </div>
      <div className="p-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className={featured ? "type-title text-2xl md:text-3xl mb-2" : "text-xl font-semibold mb-1"}>{movie.title}</h2>
          <p className="text-muted-foreground">{details}</p>
          {!movie.youtubeId && (
            <a
              href={movie.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent-text hover:underline"
            >
              Fiche sur AniList <ExternalLink size={14} aria-hidden />
            </a>
          )}
        </div>
        {movie.score != null && (
          <span className="shrink-0 rounded-lg bg-muted px-3 py-1 font-semibold">
            <span className="text-accent-text" aria-hidden>★</span> {movie.score}
            <span className="sr-only"> sur 100</span>
            <span aria-hidden className="text-muted-foreground font-normal">/100</span>
          </span>
        )}
      </div>
    </article>
  );
}
