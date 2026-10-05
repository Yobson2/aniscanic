// AniList GraphQL API — free, no key. https://docs.anilist.co

const API = 'https://graphql.anilist.co';

async function anilist<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`AniList ${res.status}`);
  const json = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`AniList: ${json.errors[0].message}`);
  return json.data;
}

interface RawMedia {
  id: number;
  siteUrl: string;
  title: { english: string | null; romaji: string };
  seasonYear: number | null;
  duration: number | null;
  averageScore: number | null;
  genres: string[];
  bannerImage: string | null;
  coverImage: { extraLarge: string; color: string | null };
  studios?: { nodes: { name: string }[] };
  trailer: { site: string; id: string } | null;
  chapters?: number | null;
}

export interface AnimeMovie {
  id: number;
  siteUrl: string;
  title: string;
  year: number | null;
  durationMinutes: number | null;
  score: number | null;
  genres: string[];
  image: string;
  studio: string | null;
  youtubeId: string | null;
}

export interface RankedManga {
  id: number;
  siteUrl: string;
  title: string;
  score: number | null;
  genres: string[];
  cover: string;
  chapters: number | null;
}

const title = (m: RawMedia) => m.title.english ?? m.title.romaji;

export async function getPopularMovies(perPage = 12): Promise<AnimeMovie[]> {
  const data = await anilist<{ Page: { media: RawMedia[] } }>(
    `query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC, isAdult: false) {
          id siteUrl title { english romaji } seasonYear duration averageScore genres
          bannerImage coverImage { extraLarge color }
          studios(isMain: true) { nodes { name } }
          trailer { site id }
        }
      }
    }`,
    { perPage }
  );
  return data.Page.media.map((m) => ({
    id: m.id,
    siteUrl: m.siteUrl,
    title: title(m),
    year: m.seasonYear,
    durationMinutes: m.duration,
    score: m.averageScore,
    genres: m.genres.slice(0, 2),
    image: m.bannerImage ?? m.coverImage.extraLarge,
    studio: m.studios?.nodes[0]?.name ?? null,
    youtubeId: m.trailer?.site === 'youtube' ? m.trailer.id : null,
  }));
}

export async function getTopRatedManga(perPage = 10): Promise<RankedManga[]> {
  const data = await anilist<{ Page: { media: RawMedia[] } }>(
    `query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(type: MANGA, sort: SCORE_DESC, isAdult: false, popularity_greater: 20000) {
          id siteUrl title { english romaji } averageScore genres chapters
          coverImage { extraLarge color }
        }
      }
    }`,
    { perPage }
  );
  return data.Page.media.map((m) => ({
    id: m.id,
    siteUrl: m.siteUrl,
    title: title(m),
    score: m.averageScore,
    genres: m.genres.slice(0, 2),
    cover: m.coverImage.extraLarge,
    chapters: m.chapters ?? null,
  }));
}
