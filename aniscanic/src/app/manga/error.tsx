'use client';

import Link from 'next/link';
import { routes } from '@/constants';

export default function MangaError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="on-ink min-h-screen bg-surface-ink text-brand-light pt-32 px-4">
      <div className="max-w-xl mx-auto flex flex-col items-start gap-6">
        <h1 className="type-title text-3xl">MangaDex ne répond pas</h1>
        <p className="text-white/80">
          Le service qui héberge les chapitres est momentanément indisponible ou reçoit trop de demandes.
          Réessaie dans quelques secondes.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-brand-red text-brand-dark font-semibold hover:bg-brand-gold transition-colors"
          >
            Réessayer
          </button>
          <Link
            href={routes.manga}
            className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20 transition-colors"
          >
            Retour à la bibliothèque
          </Link>
        </div>
      </div>
    </div>
  );
}
