import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { routes } from '@/constants';
import { getRatings, PAGE_SIZE, searchManga, STATUS_LABELS, type Manga } from '@/lib/api/mangadex';

export const metadata = { title: 'Bibliothèque Manga — Aniscanic' };

async function loadCatalog(query: string, page: number) {
  try {
    const { manga, total } = await searchManga(query, page);
    const ratings = await getRatings(manga.map((m) => m.id)).catch(() => ({}) as Record<string, number | null>);
    return { manga, total, ratings, error: false as const };
  } catch {
    return { manga: [] as Manga[], total: 0, ratings: {} as Record<string, number | null>, error: true as const };
  }
}

function pageHref(query: string, page: number) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${routes.manga}?${qs}` : routes.manga;
}

export default async function MangaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page: pageParam } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number(pageParam) || 1);
  const { manga, total, ratings, error } = await loadCatalog(query, page);
  const lastPage = Math.max(1, Math.ceil(Math.min(total, 10000) / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Bibliothèque Manga"
        subtitle="Des mangas disponibles en français, à lire directement sur Aniscanic"
      >
        <form action={routes.manga} role="search" className="flex flex-col md:flex-row gap-4">
          <label className="flex-1 relative">
            <span className="sr-only">Rechercher un manga</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Rechercher un manga..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-brand-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-dark text-white rounded-full hover:bg-brand-gold hover:text-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Rechercher
          </button>
        </form>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {error ? (
          <p className="rounded-2xl bg-card shadow-card p-8 text-center text-muted-foreground">
            Le catalogue MangaDex ne répond pas pour le moment. Recharge la page dans quelques instants.
          </p>
        ) : manga.length === 0 ? (
          <p className="rounded-2xl bg-card shadow-card p-8 text-center text-muted-foreground">
            Aucun manga avec des chapitres en français ne correspond à « {query} ». Essaie un autre titre.
          </p>
        ) : (
          <>
            {query && (
              <p className="mb-6 text-muted-foreground">
                {total} résultat{total > 1 ? 's' : ''} pour « {query} »
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {manga.map((m) => {
                const rating = ratings[m.id];
                return (
                  <Link
                    key={m.id}
                    href={routes.mangaDetail(m.id)}
                    className="group bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                  >
                    <div className="relative aspect-[2/3] bg-muted">
                      {m.coverUrl && (
                        <Image
                          src={m.coverUrl}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      )}
                      {rating != null && (
                        <span className="absolute top-3 right-3 bg-white/90 text-brand-dark backdrop-blur-sm px-2.5 py-1 rounded-full text-sm font-semibold">
                          <span className="text-brand-red" aria-hidden>★</span> {rating.toFixed(1)}
                          <span className="sr-only"> sur 10</span>
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-bold leading-snug line-clamp-2">{m.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[m.genres[0], STATUS_LABELS[m.status]].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {lastPage > 1 && (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
                {page > 1 && (
                  <Link
                    href={pageHref(query, page - 1)}
                    className="inline-flex items-center gap-1 px-5 py-3 rounded-full bg-card shadow-card hover:bg-brand-gold hover:text-brand-dark transition-colors"
                  >
                    <ChevronLeft size={18} aria-hidden /> Page précédente
                  </Link>
                )}
                <span className="text-muted-foreground">
                  Page {page} sur {lastPage}
                </span>
                {page < lastPage && (
                  <Link
                    href={pageHref(query, page + 1)}
                    className="inline-flex items-center gap-1 px-5 py-3 rounded-full bg-card shadow-card hover:bg-brand-gold hover:text-brand-dark transition-colors"
                  >
                    Page suivante <ChevronRight size={18} aria-hidden />
                  </Link>
                )}
              </nav>
            )}
          </>
        )}

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Catalogue et chapitres fournis par{' '}
          <a href="https://mangadex.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-red">
            MangaDex
          </a>{' '}
          et traduits par des groupes de fans, crédités sur chaque chapitre.
        </p>
      </div>
    </div>
  );
}
