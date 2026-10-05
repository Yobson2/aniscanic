import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MangaCoverCard from '@/components/manga-cover-card';
import SearchForm from '@/components/search-form';
import PageHeader from '@/components/page-header';
import { routes } from '@/constants';
import { getRatings, PAGE_SIZE, searchManga, type Manga } from '@/lib/api/mangadex';

export const metadata = { title: 'Bibliothèque Manga - Aniscanic' };

async function loadCatalog(query: string, page: number) {
  try {
    const { manga, total } = await searchManga(query, page);
    const ratings = await getRatings(manga.map((m) => m.id)).catch(() => ({}) as Record<string, number | null>);
    return { manga, total, ratings, error: false as const };
  } catch {
    return { manga: [] as Manga[], total: 0, ratings: {} as Record<string, number | null>, error: true as const };
  }
}

const number = new Intl.NumberFormat('fr-FR');
const pagerLink =
  'inline-flex h-12 items-center gap-1 rounded-xl bg-card px-5 font-semibold shadow-card transition-colors hover:bg-brand-gold hover:text-brand-dark';

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
        title="Bibliothèque manga"
        subtitle="Les séries traduites en français par les groupes de fans, à lire directement ici."
      >
        <SearchForm defaultValue={query} className="max-w-2xl" />
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {error ? (
          <div className="rounded-xl bg-card p-8 shadow-card">
            <h2 className="text-xl font-semibold">Le catalogue MangaDex ne répond pas</h2>
            <p className="mt-2 text-muted-foreground">Recharge la page dans quelques secondes.</p>
          </div>
        ) : manga.length === 0 ? (
          <div className="rounded-xl bg-card p-8 shadow-card">
            <h2 className="text-xl font-semibold">Aucune série trouvée pour « {query} »</h2>
            <p className="mt-2 text-muted-foreground">
              Seules les séries avec des chapitres en français apparaissent. Essaie le titre original en romaji, ou{" "}
              <Link href={routes.manga} className="font-semibold text-accent-text underline underline-offset-4">parcours les plus suivies</Link>.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-8 text-muted-foreground" aria-live="polite">
              {query
                ? `${number.format(total)} résultat${total > 1 ? "s" : ""} pour « ${query} »`
                : "Les plus suivies d’abord"}
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-6">
              {manga.map((m) => (
                <li key={m.id}>
                  <MangaCoverCard manga={m} rating={ratings[m.id]} />
                </li>
              ))}
            </ul>

            {lastPage > 1 && (
              <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-3">
                {page > 1 && (
                  <Link href={pageHref(query, page - 1)} className={pagerLink}>
                    <ChevronLeft size={18} aria-hidden /> Précédente
                  </Link>
                )}
                <span className="px-2 text-muted-foreground" aria-current="page">
                  Page {page} sur {number.format(lastPage)}
                </span>
                {page < lastPage && (
                  <Link href={pageHref(query, page + 1)} className={pagerLink}>
                    Suivante <ChevronRight size={18} aria-hidden />
                  </Link>
                )}
              </nav>
            )}
          </>
        )}

        <p className="mt-14 text-center text-sm text-muted-foreground">
          Catalogue et chapitres fournis par{" "}
          <a href="https://mangadex.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-text">
            MangaDex
          </a>{" "}
          et traduits par des groupes de fans, crédités sur chaque chapitre.
        </p>
      </div>
    </div>
  );
}
