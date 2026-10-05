import PageHeader from '@/components/page-header';
import MovieCard from '@/components/movie-card';
import { getPopularMovies } from '@/lib/api/anilist';

export const metadata = { title: 'Films d’animation — Aniscanic' };

export default async function MoviesPage() {
  const movies = await getPopularMovies(12).catch(() => null);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Films d’animation"
        subtitle="Les films anime les plus populaires sur AniList. Lance la bande-annonce sans quitter la page."
      />

      <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-16">
        {movies === null ? (
          <p className="rounded-xl bg-card shadow-card p-8 text-muted-foreground">
            La liste des films n’a pas pu être chargée. Recharge la page dans quelques instants.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {movies.map((movie, i) => (
              <li key={movie.id} className={i === 0 ? "md:col-span-2" : undefined}>
                <MovieCard movie={movie} featured={i === 0} />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Données et classement :{' '}
          <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-text">
            AniList
          </a>
          . Bandes-annonces hébergées sur YouTube.
        </p>
      </div>
    </div>
  );
}
