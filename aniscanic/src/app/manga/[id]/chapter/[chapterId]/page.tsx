import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { routes } from '@/constants';
import { getChapter, getChapterPages, getChapters, getManga, getNeighbours, isNotFound, type Chapter } from '@/lib/api/mangadex';

type Params = Promise<{ id: string; chapterId: string }>;

function chapterLabel(c: Chapter) {
  return c.number ? `Chapitre ${c.number}` : 'Chapitre unique';
}

async function loadReader(mangaId: string, chapterId: string) {
  let chapter: Chapter;
  try {
    chapter = await getChapter(chapterId);
  } catch (e) {
    if (isNotFound(e)) notFound();
    throw e; // shown by manga/error.tsx with a retry button
  }
  if (chapter.mangaId !== mangaId || chapter.externalUrl) notFound();

  const [manga, chapters, pages] = await Promise.all([
    getManga(mangaId),
    getChapters(mangaId).catch(() => [] as Chapter[]),
    getChapterPages(chapterId).catch(() => null),
  ]);
  return { chapter, manga, pages, ...getNeighbours(chapters, chapter) };
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id, chapterId } = await params;
  const [manga, chapter] = await Promise.all([getManga(id).catch(() => null), getChapter(chapterId).catch(() => null)]);
  if (!manga || !chapter) return { title: 'Chapitre introuvable — Aniscanic' };
  return { title: `${manga.title}, ${chapterLabel(chapter).toLowerCase()} — Aniscanic` };
}

const navButton =
  'inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold';

export default async function ChapterReaderPage({ params }: { params: Params }) {
  const { id, chapterId } = await params;
  const { chapter, manga, pages, previous, next } = await loadReader(id, chapterId);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light pt-20">
      <div className="sticky top-20 z-40 bg-brand-dark/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href={routes.mangaDetail(manga.id)} className="min-w-0 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-lg">
            <span className="block truncate font-semibold">{manga.title}</span>
            <span className="block text-sm text-white/60">
              {chapterLabel(chapter)}
              {chapter.title ? ` – ${chapter.title}` : ''}
            </span>
          </Link>
          <nav aria-label="Navigation entre chapitres" className="flex shrink-0 gap-2">
            {previous ? (
              <Link href={routes.chapter(manga.id, previous.id)} className={`${navButton} bg-white/10 hover:bg-white/20`}>
                <ChevronLeft size={16} aria-hidden /> <span className="hidden sm:inline">Précédent</span>
                <span className="sr-only sm:hidden">Chapitre précédent</span>
              </Link>
            ) : null}
            {next ? (
              <Link href={routes.chapter(manga.id, next.id)} className={`${navButton} bg-brand-red text-white hover:bg-brand-gold hover:text-brand-dark`}>
                <span className="hidden sm:inline">Suivant</span>
                <span className="sr-only sm:hidden">Chapitre suivant</span> <ChevronRight size={16} aria-hidden />
              </Link>
            ) : null}
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-0 sm:px-4 py-6">
        {pages === null ? (
          <p className="mx-4 rounded-2xl bg-white/5 p-6 text-white/80">
            Les pages de ce chapitre n’ont pas pu être chargées. Recharge la page dans quelques instants.
          </p>
        ) : (
          <div className="flex flex-col gap-1 sm:gap-2">
            {pages.map((src, index) => (
              // Plain <img>: page dimensions are unknown and the source is already our proxy.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`Page ${index + 1} sur ${pages.length}`}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-auto bg-white/5 sm:rounded-lg"
              />
            ))}
          </div>
        )}

        <footer className="mx-4 sm:mx-0 mt-10 flex flex-col gap-6">
          {next ? (
            <Link
              href={routes.chapter(manga.id, next.id)}
              className="flex items-center justify-between gap-4 rounded-3xl bg-brand-gold text-brand-dark px-6 py-5 font-semibold hover:bg-brand-red hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>
                <span className="block text-sm font-medium opacity-80">À suivre</span>
                <span className="text-lg">{chapterLabel(next)}</span>
              </span>
              <ChevronRight size={24} aria-hidden />
            </Link>
          ) : (
            <Link
              href={routes.mangaDetail(manga.id)}
              className="flex items-center gap-3 rounded-3xl bg-white/10 px-6 py-5 font-semibold hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <BookOpen size={22} aria-hidden />
              Tu es à jour : c’est le dernier chapitre en français. Retour à la fiche
            </Link>
          )}

          <p className="text-sm text-white/60 pb-10">
            {chapter.groups.length > 0 ? `Traduit par ${chapter.groups.join(', ')}. ` : ''}
            Hébergé par{' '}
            <a
              href={`https://mangadex.org/chapter/${chapter.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-gold"
            >
              MangaDex
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
