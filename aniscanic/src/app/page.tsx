import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';
import { routes } from '@/constants';
import Planche from '@/components/home/planche';
import MangaCoverCard from '@/components/manga-cover-card';
import SearchForm from '@/components/search-form';
import { getLatestReleases, getRatings } from '@/lib/api/mangadex';
import { getPopularMovies, getTopRatedManga } from '@/lib/api/anilist';
import { getQuestionCounts } from '@/lib/api/opentdb';

const number = new Intl.NumberFormat('fr-FR');
const day = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' });

async function loadHome() {
  const [releases, movies, topManga, quizCounts] = await Promise.all([
    getLatestReleases(17).catch(() => []),
    getPopularMovies(3).catch(() => null),
    getTopRatedManga(5).catch(() => null),
    getQuestionCounts().catch(() => null),
  ]);
  const shelf = releases.slice(5);
  const ratings = await getRatings(shelf.map((r) => r.manga.id)).catch(() => ({}) as Record<string, number | null>);
  return { releases, shelf, ratings, movies, topManga, quizCounts };
}

const sectionTitle = 'type-title text-[clamp(1.75rem,2.2vw+1rem,2.5rem)]';
const textLink =
  'inline-flex min-h-11 items-center gap-1 rounded-lg font-semibold text-accent-text hover:underline underline-offset-4';

const readingSteps = [
  {
    title: 'Choisis une série',
    body: 'Cherche un titre, ou pars des dernières sorties. La bibliothèque ne montre que les séries traduites en français.',
  },
  {
    title: 'Commence là où la traduction commence',
    body: 'Les groupes de fans reprennent souvent une série en cours de route : la fiche indique le premier chapitre disponible en français.',
  },
  {
    title: 'Enchaîne les chapitres',
    body: 'Le lecteur affiche les pages à la suite et propose le chapitre suivant à la fin. Les chapitres publiés par un éditeur s’ouvrent sur son site officiel.',
  },
];

const faq = [
  {
    q: 'Faut-il un compte ou payer quelque chose ?',
    a: 'Non. Tout se lit directement dans le navigateur, sans inscription et sans publicité.',
  },
  {
    q: 'D’où viennent les chapitres ?',
    a: 'Ils sont traduits par des groupes de fans et hébergés par MangaDex. Le nom du groupe est affiché sur chaque chapitre.',
  },
  {
    q: 'Pourquoi une série démarre-t-elle au chapitre 40 ?',
    a: 'La traduction française n’existe pas toujours depuis le début. Le bouton de lecture de la fiche t’amène au premier chapitre disponible.',
  },
  {
    q: 'Pourquoi certains chapitres ouvrent-ils un autre site ?',
    a: 'Quand un éditeur publie officiellement la série, ses chapitres se lisent sur son site. Ils sont marqués « Site officiel » dans la liste.',
  },
  {
    q: 'Le quiz est-il en français ?',
    a: 'Les questions viennent d’Open Trivia DB et sont en anglais. L’interface, elle, reste en français. Tes meilleurs scores sont gardés sur cet appareil.',
  },
];

export default async function Home() {
  const { releases, shelf, ratings, movies, topManga, quizCounts } = await loadHome();
  const hero = releases.slice(0, 5);

  return (
    <>
      {/* Hero: what it is, and the product itself (live covers) */}
      <section aria-labelledby="hero-title" className="on-ink bg-surface-ink text-brand-light">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-24 md:px-6 md:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-20 lg:pt-28">
          <div className="flex flex-col gap-6">
            <h1 id="hero-title" className="type-display text-[clamp(2.5rem,3.8vw+1rem,4.25rem)]">
              Tes mangas en français, à lire ici.
            </h1>
            <p className="max-w-xl text-lg text-brand-light/75 md:text-xl">
              Les traductions des groupes de fans, avec les nouveaux chapitres dès leur sortie sur MangaDex. Sans
              compte, sans publicité.
            </p>
            <SearchForm className="max-w-xl" />
            <Link href={routes.manga} className="inline-flex min-h-11 w-fit items-center gap-1 rounded-lg font-semibold text-brand-gold hover:underline underline-offset-4">
              Parcourir toute la bibliothèque <ChevronRight size={18} aria-hidden />
            </Link>
          </div>

          {hero.length > 0 ? (
            <Planche releases={hero} />
          ) : (
            <p className="rounded-xl bg-white/5 p-8 text-brand-light/75">
              Les couvertures n’ont pas pu être chargées depuis MangaDex. La recherche fonctionne toujours.
            </p>
          )}
        </div>
      </section>

      {/* The catalogue, continued */}
      {shelf.length > 0 && (
        <section aria-labelledby="popular-title" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="popular-title" className={sectionTitle}>Nouveaux chapitres en français</h2>
                <p className="mt-2 text-muted-foreground">Les séries qui viennent de recevoir un chapitre, de la plus récente à la plus ancienne.</p>
              </div>
              <Link href={routes.manga} className={textLink}>
                Toute la bibliothèque <ChevronRight size={18} aria-hidden />
              </Link>
            </div>
            <ul className="shelf -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-6">
              {shelf.map(({ manga, chapter }) => (
                <li key={manga.id} className="w-[42vw] max-w-48 shrink-0 md:w-auto md:max-w-none">
                  <MangaCoverCard
                    manga={manga}
                    rating={ratings[manga.id]}
                    meta={[chapter.number ? `Chapitre ${chapter.number}` : 'Chapitre unique', day.format(new Date(chapter.publishedAt))].join(', ')}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* How reading works: a real sequence, so it is numbered */}
      <section aria-labelledby="reading-title" className="bg-card py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 id="reading-title" className={`${sectionTitle} max-w-2xl`}>De la recherche au dernier chapitre</h2>
          <ol className="mt-10 grid gap-gutter md:grid-cols-3">
            {readingSteps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-3 rounded-xl bg-background p-6 md:p-8">
                <span aria-hidden className="type-title flex size-11 items-center justify-center rounded-full bg-brand-red text-lg text-brand-dark">
                  {i + 1}
                </span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The rest of the product, each with live content */}
      <section aria-labelledby="more-title" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 id="more-title" className={`${sectionTitle} mb-10 max-w-2xl`}>Entre deux chapitres</h2>
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
            {/* Films */}
            <article className="on-ink flex flex-col gap-6 rounded-xl bg-surface-ink p-6 text-brand-light md:p-8 lg:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="type-title text-2xl">Films d’animation</h3>
                  <p className="mt-2 max-w-md text-brand-light/70">Les films anime les plus populaires sur AniList, avec leur bande-annonce.</p>
                </div>
                <Link href={routes.movie} className="inline-flex min-h-11 items-center gap-1 rounded-lg font-semibold text-brand-gold hover:underline underline-offset-4">
                  Voir les films <ChevronRight size={18} aria-hidden />
                </Link>
              </div>
              {movies && movies.length > 0 && (
                <ul className="grid grid-cols-1 gap-gutter sm:grid-cols-3">
                  {movies.map((movie) => (
                    <li key={movie.id}>
                      <Link href={routes.movie} className="group flex flex-col gap-2 rounded-xl">
                        <span className="relative block aspect-video overflow-hidden rounded-xl bg-white/5">
                          <Image src={movie.image} alt="" fill sizes="(max-width: 640px) 90vw, 22vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                          {movie.youtubeId && (
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-lg bg-brand-dark/85 px-2 py-0.5 text-xs font-semibold">
                              <Play size={12} fill="currentColor" aria-hidden /> Bande-annonce
                            </span>
                          )}
                        </span>
                        <span className="font-semibold leading-snug group-hover:text-brand-gold">{movie.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            {/* Quiz */}
            <article className="flex flex-col gap-6 rounded-xl bg-brand-gold p-6 text-brand-dark md:p-8">
              <h3 className="type-title text-2xl">Quiz anime</h3>
              <p>
                Dix questions tirées au hasard, en trois niveaux.
                {quizCounts && ` La réserve en compte ${number.format(quizCounts.total)}, et chaque partie en pioche de nouvelles.`}
              </p>
              {quizCounts && (
                <dl className="grid grid-cols-3 gap-2 text-center">
                  {([['Facile', quizCounts.easy], ['Intermédiaire', quizCounts.medium], ['Difficile', quizCounts.hard]] as const).map(([label, count]) => (
                    <div key={label} className="rounded-xl bg-brand-dark/10 px-2 py-3">
                      <dt className="text-sm">{label}</dt>
                      <dd className="type-title text-xl">{count}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <Link href={routes.quiz} className="mt-auto inline-flex h-12 w-fit items-center rounded-xl bg-brand-dark px-6 font-semibold text-brand-light hover:bg-brand-dark/85">
                Lancer un quiz
              </Link>
            </article>

            {/* Ranking */}
            {topManga && topManga.length > 0 && (
              <article className="flex flex-col gap-6 rounded-xl bg-card p-6 shadow-card md:p-8 lg:col-span-3">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h3 className="type-title text-2xl">Les mangas les mieux notés</h3>
                    <p className="mt-2 text-muted-foreground">Note moyenne des lecteurs AniList, sur 100.</p>
                  </div>
                  <Link href={routes.ranking} className={textLink}>
                    Tout le classement <ChevronRight size={18} aria-hidden />
                  </Link>
                </div>
                <ol className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-5">
                  {topManga.map((m, i) => (
                    <li key={m.id}>
                      <Link href={`${routes.manga}?q=${encodeURIComponent(m.title)}`} className="group flex items-center gap-3 rounded-xl bg-background p-3 hover:bg-muted">
                        <span className="type-title w-6 shrink-0 text-center text-lg text-accent-text">{i + 1}</span>
                        <Image src={m.cover} alt="" width={44} height={64} className="h-16 w-11 shrink-0 rounded-lg object-cover" />
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-sm font-semibold leading-snug">{m.title}</span>
                          {m.score != null && <span className="text-sm text-muted-foreground">{m.score}/100</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* Questions people actually have about where the content comes from */}
      <section aria-labelledby="faq-title" className="bg-card py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="faq-title" className={sectionTitle}>Bon à savoir</h2>
            <p className="mt-3 max-w-sm text-muted-foreground">Comment Aniscanic fonctionne, et d’où vient ce que tu lis.</p>
          </div>
          <div className="flex flex-col gap-2">
            {faq.map(({ q, a }) => (
              <details key={q} className="group rounded-xl bg-background open:bg-muted/60">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronRight size={20} aria-hidden className="shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="max-w-prose px-5 pb-5 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Close with the primary action again */}
      <section aria-labelledby="cta-title" className="px-4 py-16 md:px-6 md:py-24">
        <div className="on-ink mx-auto flex max-w-7xl flex-col gap-8 rounded-xl bg-surface-ink px-6 py-12 text-brand-light md:px-12 md:py-16 lg:flex-row lg:items-center lg:justify-between">
          <h2 id="cta-title" className="type-display max-w-lg text-[clamp(2rem,3vw+1rem,3.25rem)]">Quelle série lis-tu en ce moment ?</h2>
          <SearchForm className="w-full lg:max-w-xl" />
        </div>
      </section>
    </>
  );
}
