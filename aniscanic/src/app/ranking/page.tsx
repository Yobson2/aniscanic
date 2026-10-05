import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { routes } from '@/constants';
import { cn } from '@/lib/utils';
import { getTopRatedManga, type MangaRankingSort, type RankedManga } from '@/lib/api/anilist';

export const metadata = { title: 'Classement manga - Aniscanic' };

const RANKING_SIZE = 20;

const tabs: { sort: MangaRankingSort; param: string; label: string; caption: string }[] = [
  { sort: 'score', param: 'notes', label: 'Mieux notés', caption: 'Note moyenne des lecteurs AniList, parmi les mangas suivis par plus de 20 000 personnes.' },
  { sort: 'popularity', param: 'popularite', label: 'Plus populaires', caption: 'Nombre de lecteurs AniList qui ont ajouté le manga à leur liste.' },
];

/** Search the French library for this title (AniList and MangaDex ids don't match). */
const libraryHref = (m: RankedManga) => `${routes.manga}?q=${encodeURIComponent(m.title)}`;

function Score({ manga }: { manga: RankedManga }) {
  if (manga.score == null) return null;
  return (
    <span className="font-semibold">
      {manga.score}
      <span className="text-sm font-normal text-muted-foreground">/100</span>
    </span>
  );
}

export default async function RankingPage({ searchParams }: { searchParams: Promise<{ tri?: string }> }) {
  const { tri } = await searchParams;
  const active = tabs.find((t) => t.param === tri) ?? tabs[0];
  const ranking = await getTopRatedManga(RANKING_SIZE, active.sort).catch(() => null);
  const podium = ranking?.slice(0, 3) ?? [];
  const rest = ranking?.slice(3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Classement manga"
        subtitle="Les mangas les mieux notés et les plus lus, d’après la communauté AniList. Clique sur un titre pour le chercher en français."
      >
        <nav aria-label="Type de classement" className="inline-flex flex-wrap gap-1 rounded-xl bg-white/10 p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.param}
              href={tab === tabs[0] ? routes.ranking : `${routes.ranking}?tri=${tab.param}`}
              aria-current={tab === active ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 items-center rounded-lg px-5 font-semibold transition-colors',
                tab === active ? 'bg-brand-gold text-brand-dark' : 'text-brand-light/80 hover:text-brand-light hover:bg-white/10'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {ranking === null ? (
          <div className="rounded-xl bg-card p-8 shadow-card">
            <h2 className="text-xl font-semibold">Le classement AniList ne répond pas</h2>
            <p className="mt-2 text-muted-foreground">Recharge la page dans quelques secondes.</p>
          </div>
        ) : (
          <>
            <p className="mb-8 max-w-2xl text-muted-foreground">{active.caption}</p>

            {/* Top 3: covers carry the podium */}
            <ol className="grid grid-cols-1 gap-gutter sm:grid-cols-3">
              {podium.map((m, i) => (
                <li key={m.id}>
                  <Link href={libraryHref(m)} className="group flex h-full flex-col gap-4 rounded-xl bg-card p-4 shadow-card hover:bg-muted md:p-5">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted sm:aspect-square">
                      <Image
                        src={m.cover}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="(max-width: 640px) 90vw, 30vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="type-display absolute left-3 top-3 flex size-12 items-center justify-center rounded-xl bg-brand-gold text-2xl text-brand-dark">
                        {i + 1}
                      </span>
                    </span>
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="type-title block text-lg">{m.title}</span>
                        <span className="text-sm text-muted-foreground">{m.genres.join(', ')}</span>
                      </span>
                      <Score manga={m} />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <ol start={4} className="mt-gutter grid grid-cols-1 gap-2 md:grid-cols-2">
              {rest.map((m, i) => (
                <li key={m.id}>
                  <Link href={libraryHref(m)} className="flex items-center gap-4 rounded-xl bg-card p-3 shadow-card hover:bg-muted">
                    <span className="type-title w-8 shrink-0 text-center text-lg text-accent-text">{i + 4}</span>
                    <Image src={m.cover} alt="" width={48} height={68} className="h-[68px] w-12 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{m.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {[m.genres.join(', '), m.chapters ? `${m.chapters} chapitres` : null].filter(Boolean).join(', ')}
                      </span>
                    </span>
                    <Score manga={m} />
                  </Link>
                </li>
              ))}
            </ol>

            <p className="mt-12 text-center text-sm text-muted-foreground">
              Données{' '}
              <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-text">AniList</a>
              , mises à jour toutes les heures.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
