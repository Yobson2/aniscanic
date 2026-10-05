// MangaDex API — server-side only (import from server components / route handlers).
// Their rules (https://api.mangadex.org/docs/): no CORS for third-party sites, so every
// call goes through our server; a real User-Agent is mandatory; images must be proxied
// (see /api/mangadex/image); ~5 req/s per IP, 40 req/min on at-home/server.
// Usage policy: credit MangaDex + scanlation groups, no ads or paid services.

const API = 'https://api.mangadex.org';
const USER_AGENT = 'Aniscanic/0.1';
const CONTENT_RATINGS = ['safe', 'suggestive'];
export const READING_LANGUAGE = 'fr';

type Localized = Record<string, string>;

interface Relationship {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
}

interface RawManga {
  id: string;
  attributes: {
    title: Localized;
    altTitles: Localized[];
    description: Localized;
    status: string;
    year: number | null;
    tags: { attributes: { name: Localized; group: string } }[];
  };
  relationships: Relationship[];
}

interface RawChapter {
  id: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    pages: number;
    externalUrl: string | null;
    publishAt: string;
  };
  relationships: Relationship[];
}

export interface Manga {
  id: string;
  title: string;
  description: string;
  status: string;
  year: number | null;
  genres: string[];
  coverUrl: string | null;
  authors: string[];
}

export interface Chapter {
  id: string;
  mangaId: string | null;
  number: string | null;
  volume: string | null;
  title: string | null;
  pages: number;
  /** Set when the chapter is only readable on an official partner site */
  externalUrl: string | null;
  publishedAt: string;
  groups: string[];
}

export class MangaDexError extends Error {
  constructor(public status: number, path: string) {
    super(`MangaDex ${status} on ${path}`);
  }
}

export const isNotFound = (e: unknown) => e instanceof MangaDexError && (e.status === 404 || e.status === 400);

async function md<T>(path: string, params: Record<string, string | string[]> = {}, revalidate = 600): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const v of Array.isArray(value) ? value : [value]) query.append(key, v);
  }
  const qs = query.toString();
  const res = await fetch(`${API}${path}${qs ? `?${qs}` : ''}`, {
    headers: { 'User-Agent': USER_AGENT },
    next: { revalidate },
  });
  if (!res.ok) throw new MangaDexError(res.status, path);
  return res.json() as Promise<T>;
}

/** Routes a MangaDex image through our proxy (hotlinking is blocked by MangaDex). */
export function proxiedImage(url: string) {
  return `/api/mangadex/image?url=${encodeURIComponent(url)}`;
}

function pickLocalized(values: Localized, alt: Localized[] = []) {
  const all = [values, ...alt];
  for (const lang of [READING_LANGUAGE, 'en', 'ja-ro']) {
    const hit = all.find((v) => v[lang]);
    if (hit) return hit[lang];
  }
  return Object.values(values)[0] ?? '';
}

function toManga(raw: RawManga, coverSize: '256' | '512' = '256'): Manga {
  const cover = raw.relationships.find((r) => r.type === 'cover_art');
  const fileName = cover?.attributes?.fileName as string | undefined;
  return {
    id: raw.id,
    // The main title is usually romanized; prefer it, then fall back to localized titles.
    title: raw.attributes.title.en ?? pickLocalized(raw.attributes.title, raw.attributes.altTitles),
    description: pickLocalized(raw.attributes.description),
    status: raw.attributes.status,
    year: raw.attributes.year,
    genres: raw.attributes.tags
      .filter((t) => t.attributes.group === 'genre')
      .map((t) => t.attributes.name.en)
      .slice(0, 3),
    coverUrl: fileName
      ? proxiedImage(`https://uploads.mangadex.org/covers/${raw.id}/${fileName}.${coverSize}.jpg`)
      : null,
    authors: raw.relationships
      .filter((r) => r.type === 'author' && r.attributes?.name)
      .map((r) => r.attributes!.name as string),
  };
}

function toChapter(raw: RawChapter): Chapter {
  return {
    id: raw.id,
    mangaId: raw.relationships.find((r) => r.type === 'manga')?.id ?? null,
    number: raw.attributes.chapter,
    volume: raw.attributes.volume,
    title: raw.attributes.title,
    pages: raw.attributes.pages,
    externalUrl: raw.attributes.externalUrl,
    publishedAt: raw.attributes.publishAt,
    groups: raw.relationships
      .filter((r) => r.type === 'scanlation_group' && r.attributes?.name)
      .map((r) => r.attributes!.name as string),
  };
}

export const STATUS_LABELS: Record<string, string> = {
  ongoing: 'En cours',
  completed: 'Terminé',
  hiatus: 'En pause',
  cancelled: 'Abandonné',
};

export const PAGE_SIZE = 24;

/** Manga that have chapters translated in French, most followed first (or by relevance when searching). */
export async function searchManga(title: string, page = 1) {
  const res = await md<{ data: RawManga[]; total: number }>(
    '/manga',
    {
      ...(title ? { title, 'order[relevance]': 'desc' } : { 'order[followedCount]': 'desc' }),
      limit: String(PAGE_SIZE),
      offset: String((page - 1) * PAGE_SIZE),
      'availableTranslatedLanguage[]': READING_LANGUAGE,
      hasAvailableChapters: 'true',
      'contentRating[]': CONTENT_RATINGS,
      'includes[]': 'cover_art',
    },
    3600
  );
  return { manga: res.data.map((m) => toManga(m)), total: res.total };
}

/** Bayesian rating out of 10, keyed by manga id. */
export async function getRatings(ids: string[]): Promise<Record<string, number | null>> {
  if (ids.length === 0) return {};
  const res = await md<{ statistics: Record<string, { rating: { bayesian: number | null } }> }>(
    '/statistics/manga',
    { 'manga[]': ids },
    3600
  );
  return Object.fromEntries(Object.entries(res.statistics).map(([id, s]) => [id, s.rating.bayesian]));
}

export async function getManga(id: string) {
  const res = await md<{ data: RawManga }>(`/manga/${id}`, { 'includes[]': ['cover_art', 'author'] }, 3600);
  return toManga(res.data, '512');
}

/** Every French chapter of a manga, in reading order. */
export async function getChapters(mangaId: string) {
  const chapters: Chapter[] = [];
  const limit = 500;
  for (let offset = 0; ; offset += limit) {
    const res = await md<{ data: RawChapter[]; total: number }>(`/manga/${mangaId}/feed`, {
      'translatedLanguage[]': READING_LANGUAGE,
      'contentRating[]': CONTENT_RATINGS,
      'includes[]': 'scanlation_group',
      'order[volume]': 'asc',
      'order[chapter]': 'asc',
      limit: String(limit),
      offset: String(offset),
    });
    chapters.push(...res.data.map(toChapter));
    if (offset + limit >= res.total || offset + limit >= 2000) break;
  }
  return chapters;
}

export async function getChapter(id: string) {
  const res = await md<{ data: RawChapter }>(`/chapter/${id}`, { 'includes[]': ['scanlation_group', 'manga'] });
  return toChapter(res.data);
}

/** Page image URLs for a chapter. MD@Home URLs expire after ~15 min, so this is never cached long. */
export async function getChapterPages(id: string, quality: 'data' | 'data-saver' = 'data-saver') {
  const res = await md<{ baseUrl: string; chapter: { hash: string; data: string[]; dataSaver: string[] } }>(
    `/at-home/server/${id}`,
    {},
    300
  );
  const files = quality === 'data' ? res.chapter.data : res.chapter.dataSaver;
  return files.map((file) => proxiedImage(`${res.baseUrl}/${quality}/${res.chapter.hash}/${file}`));
}

/**
 * Previous/next readable chapters around `current`, one entry per chapter number.
 * When several groups translated the same number, the current group's release wins.
 */
export function getNeighbours(chapters: Chapter[], current: Chapter) {
  const readable = chapters.filter((c) => !c.externalUrl && c.pages > 0);
  const byNumber = new Map<string, Chapter>();
  for (const c of readable) {
    const key = c.number ?? c.id;
    const existing = byNumber.get(key);
    const sameGroup = c.groups.some((g) => current.groups.includes(g));
    if (!existing || (sameGroup && c.id !== existing.id && !existing.groups.some((g) => current.groups.includes(g)))) {
      byNumber.set(key, c);
    }
  }
  const ordered = [...byNumber.values()];
  const index = ordered.findIndex((c) => (c.number ?? c.id) === (current.number ?? current.id));
  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
