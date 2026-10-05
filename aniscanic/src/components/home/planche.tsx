import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/constants';
import { cn } from '@/lib/utils';
import type { Release } from '@/lib/api/mangadex';

// A manga page ("planche"): five panels of uneven size, separated by gutters.
// Placement on a 5-column × 6-row grid; the first panel is the splash panel.
const PANELS = [
  'col-start-1 col-end-4 row-start-1 row-end-5',
  'col-start-4 col-end-6 row-start-1 row-end-4',
  'col-start-4 col-end-6 row-start-4 row-end-7',
  'col-start-1 col-end-3 row-start-5 row-end-7',
  'col-start-3 col-end-4 row-start-5 row-end-7',
];

export default function Planche({ releases }: { releases: Release[] }) {
  const panels = releases.slice(0, PANELS.length);

  return (
    <ul
      aria-label="Derniers chapitres sortis en français"
      className="grid aspect-[5/6] w-full grid-cols-5 grid-rows-6 gap-gutter lg:aspect-[10/9]"
    >
      {PANELS.map((placement, i) => {
        const m = panels[i]?.manga;
        const chapter = panels[i]?.chapter;
        return (
          <li
            key={m?.id ?? i}
            className={cn(placement, 'panel-in relative min-h-0 overflow-hidden rounded-xl bg-white/5')}
            // Panels are laid down one after another, the way a page is read.
            // CSS (not JS) so it plays from first paint, before hydration.
            style={{ animationDelay: `${100 + i * 90}ms` }}
          >
            {m && (
              <Link href={routes.mangaDetail(m.id)} className="group absolute inset-0 rounded-xl">
                {m.coverUrl && (
                  <Image
                    src={m.coverUrl}
                    alt=""
                    fill
                    unoptimized
                    priority={i < 2}
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
                <span
                  className={cn(
                    'absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] flex-col rounded-lg bg-brand-dark/85 px-2.5 py-1 text-brand-light transition-colors group-hover:bg-brand-gold group-hover:text-brand-dark',
                    // The narrow panel is too small for a caption on phones: keep it for screen readers only
                    i === 4 && 'max-sm:sr-only'
                  )}
                >
                  <span className={cn('truncate font-semibold', i === 0 ? 'text-sm md:text-base' : 'text-xs md:text-sm')}>{m.title}</span>
                  {chapter?.number && (
                    <span className={cn('opacity-80', i === 0 ? 'text-xs md:text-sm' : 'hidden text-xs sm:block')}>Chapitre {chapter.number}</span>
                  )}
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
