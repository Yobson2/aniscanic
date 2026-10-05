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
        subtitle="Les films anime les plus populaires, avec leurs bandes-annonces"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {movies === null ? (
          <p className="rounded-2xl bg-card shadow-card p-8 text-center text-muted-foreground">
            La liste des films n’a pas pu être chargée. Recharge la page dans quelques instants.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Données et classement :{' '}
          <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-red">
            AniList
          </a>
          . Bandes-annonces hébergées sur YouTube.
        </p>
      </div>
    </div>
  );
}
