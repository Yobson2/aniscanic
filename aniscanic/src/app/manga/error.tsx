'use client';

import Link from 'next/link';
import { routes } from '@/constants';

export default function MangaError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-light pt-32 px-4">
      <div className="max-w-xl mx-auto flex flex-col items-start gap-6">
        <h1 className="font-display font-bold text-3xl">MangaDex ne répond pas</h1>
        <p className="text-white/80">
          Le service qui héberge les chapitres est momentanément indisponible ou reçoit trop de demandes.
          Réessaie dans quelques secondes.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-full bg-brand-red text-white font-semibold hover:bg-brand-gold hover:text-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Réessayer
          </button>
          <Link
            href={routes.manga}
            className="px-6 py-3 rounded-full bg-white/10 font-semibold hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Retour à la bibliothèque
          </Link>
        </div>
      </div>
    </div>
  );
}
