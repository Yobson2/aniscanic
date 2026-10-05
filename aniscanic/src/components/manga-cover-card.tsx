import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/constants';
import { STATUS_LABELS, type Manga } from '@/lib/api/mangadex';

/** Cover-first tile: the artwork carries the card, text sits underneath on the page surface. */
export default function MangaCoverCard({
  manga,
  rating,
  meta,
  sizes = '(max-width: 768px) 45vw, (max-width: 1280px) 25vw, 16vw',
}: {
  manga: Manga;
  /** MangaDex Bayesian rating out of 10 */
  rating?: number | null;
  /** Replaces the default genre and status line */
  meta?: string;
  sizes?: string;
}) {
  return (
    <Link href={routes.mangaDetail(manga.id)} className="group flex flex-col gap-3 rounded-xl">
      <span className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-muted shadow-card">
        {manga.coverUrl && (
          <Image
            src={manga.coverUrl}
            alt=""
            fill
            unoptimized
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        {rating != null && (
          <span className="absolute right-2 top-2 rounded-lg bg-brand-dark/85 px-2 py-0.5 text-sm font-semibold text-brand-light">
            <span className="text-brand-gold" aria-hidden>★</span> {rating.toFixed(1)}
            <span className="sr-only"> sur 10</span>
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 font-semibold leading-snug group-hover:text-accent-text">{manga.title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {meta ?? [manga.genres[0], STATUS_LABELS[manga.status]].filter(Boolean).join(', ')}
        </span>
      </span>
    </Link>
  );
}
