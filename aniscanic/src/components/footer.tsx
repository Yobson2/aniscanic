import Link from 'next/link'
import { routes } from '@/constants'
import { AniscanicLogo } from './ui/logo'

const explore = [
  { href: routes.manga, label: 'Bibliothèque manga' },
  { href: routes.movie, label: 'Films d’animation' },
  { href: routes.quiz, label: 'Quiz anime' },
  { href: routes.ranking, label: 'Classement' },
]

const sources = [
  { href: 'https://mangadex.org', label: 'MangaDex', role: 'chapitres et couvertures' },
  { href: 'https://anilist.co', label: 'AniList', role: 'films, notes et classements' },
  { href: 'https://opentdb.com', label: 'Open Trivia DB', role: 'questions du quiz' },
]

const linkClass = 'rounded-md text-brand-light/75 hover:text-brand-gold transition-colors'

export default function Footer() {
  return (
    <footer className="on-ink bg-surface-ink text-brand-light">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1.2fr] md:px-6 md:py-20">
        <div className="flex max-w-sm flex-col gap-4">
          <AniscanicLogo variant="full" size="md" surface="dark" />
          <p className="text-brand-light/70">
            Des mangas traduits en français par les groupes de fans, les films d’animation les plus vus et un quiz
            pour tester ta culture.
          </p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="mb-4 font-semibold">Explorer</h2>
          <ul className="flex flex-col gap-3">
            {explore.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-semibold">Sources</h2>
          <ul className="flex flex-col gap-3">
            {sources.map(({ href, label, role }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <span className="font-medium text-brand-light">{label}</span>
                  <span className="text-brand-light/60">, {role}</span>
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-10 text-sm text-brand-light/55 md:px-6">
        Les chapitres sont hébergés par MangaDex et crédités au groupe de traduction qui les a publiés.
      </div>
    </footer>
  )
}
