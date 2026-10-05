import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BookOpen, ExternalLink, ChevronLeft } from 'lucide-react';
import { routes } from '@/constants';
import { getChapters, getManga, isNotFound, STATUS_LABELS, type Chapter } from '@/lib/api/mangadex';

type Params = Promise<{ id: string }>;

async function loadManga(id: string) {
  try {
    return await getManga(id);
  } catch (e) {
    if (isNotFound(e)) notFound();
    throw e; // shown by manga/error.tsx with a retry button
  }
}

/** MangaDex descriptions are Markdown with a links footer after "---"; keep the plain synopsis. */
function plainSynopsis(text: string) {
  return text
    .split(/\n-{3,}/)[0]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .trim();
}

function chapterLabel(c: Chapter) {
  return c.number ? `Chapitre ${c.number}` : 'Chapitre unique';
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const manga = await getManga(id).catch(() => null);
  return { title: manga ? `${manga.title} — Aniscanic` : 'Manga introuvable — Aniscanic' };
}

export default async function MangaDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const manga = await loadManga(id);
  const chapters = await getChapters(id).catch(() => null);

  // Chapters with neither pages nor an official link are unreadable placeholders.
  const listed = chapters?.filter((c) => c.externalUrl || c.pages > 0) ?? null;
  const readable = listed?.filter((c) => !c.externalUrl) ?? [];
  const first = readable[0];
  const latest = readable.at(-1);
  const synopsis = plainSynopsis(manga.description);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-brand-dark text-brand-light pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href={routes.manga}
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-brand-gold mb-8"
          >
            <ChevronLeft size={16} aria-hidden /> Bibliothèque
          </Link>

          <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12">
            <div className="relative aspect-[2/3] w-48 md:w-full rounded-3xl overflow-hidden bg-white/5 shadow-card">
              {manga.coverUrl && (
                <Image src={manga.coverUrl} alt={`Couverture de ${manga.title}`} fill unoptimized priority sizes="240px" className="object-cover" />
              )}
            </div>

            <div className="flex flex-col gap-5 min-w-0">
              <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
                {manga.title}
              </h1>
              <p className="text-white/70">
                {[manga.authors.join(', '), manga.year, STATUS_LABELS[manga.status]].filter(Boolean).join(' – ')}
              </p>
              {manga.genres.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Genres">
                  {manga.genres.map((g) => (
                    <li key={g} className="px-3 py-1 rounded-full bg-white/10 text-sm">{g}</li>
                  ))}
                </ul>
              )}
              {synopsis && (
                <p className="max-w-prose text-white/85 leading-relaxed whitespace-pre-line line-clamp-[10]">{synopsis}</p>
              )}

              {first && (
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={routes.chapter(manga.id, first.id)}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-brand-gold text-brand-dark px-6 py-4 font-semibold hover:bg-brand-red hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <BookOpen size={20} aria-hidden />
                    {/* The French feed often starts mid-series: say where reading actually begins */}
                    {first.number && Number(first.number) > 1
                      ? `Lire à partir du chapitre ${first.number}`
                      : 'Commencer la lecture'}
                  </Link>
                  {latest && latest.id !== first.id && (
                    <Link
                      href={routes.chapter(manga.id, latest.id)}
                      className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-4 font-semibold hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Dernier chapitre ({latest.number ?? '—'})
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12" aria-labelledby="chapters-title">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 id="chapters-title" className="text-2xl font-bold">Chapitres en français</h2>
          {listed && <span className="text-muted-foreground">{listed.length}</span>}
        </div>

        {listed === null ? (
          <p className="rounded-2xl bg-card shadow-card p-6 text-muted-foreground">
            La liste des chapitres n’a pas pu être chargée. Recharge la page dans quelques instants.
          </p>
        ) : listed.length === 0 ? (
          <p className="rounded-2xl bg-card shadow-card p-6 text-muted-foreground">
            Aucun chapitre en français pour ce manga pour l’instant.
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {[...listed].reverse().map((c) => {
              const meta = (
                <>
                  <span className="min-w-0">
                    <span className="font-semibold">{chapterLabel(c)}</span>
                    {c.title && <span className="text-muted-foreground"> – {c.title}</span>}
                    <span className="block text-sm text-muted-foreground">
                      {c.groups.length > 0 ? `Traduit par ${c.groups.join(', ')}` : 'Groupe de traduction inconnu'}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-sm text-muted-foreground">
                    {c.externalUrl ? (
                      <span className="inline-flex items-center gap-1 text-brand-red font-medium">
                        Site officiel <ExternalLink size={14} aria-hidden />
                      </span>
                    ) : (
                      <time dateTime={c.publishedAt}>{dateFormat.format(new Date(c.publishedAt))}</time>
                    )}
                  </span>
                </>
              );
              const rowClass =
                'flex items-center justify-between gap-4 rounded-xl bg-card shadow-card px-5 py-4 hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red';
              return (
                <li key={c.id}>
                  {c.externalUrl ? (
                    <a href={c.externalUrl} target="_blank" rel="noopener noreferrer" className={rowClass}>
                      {meta}
                    </a>
                  ) : (
                    <Link href={routes.chapter(manga.id, c.id)} className={rowClass}>
                      {meta}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        <p className="mt-10 text-sm text-muted-foreground">
          Chapitres hébergés par{' '}
          <a href={`https://mangadex.org/title/${manga.id}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-red">
            MangaDex
          </a>
          . Merci aux groupes de traduction cités pour leur travail.
        </p>
      </section>
    </div>
  );
}
