'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import SearchForm from '@/components/search-form';
import { AnimatePresence, motion } from 'framer-motion';
import { routes } from '@/constants';
import { AniscanicLogo } from '@/components/ui/logo';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: routes.manga, label: 'Mangas' },
  { href: routes.movie, label: 'Films' },
  { href: routes.quiz, label: 'Quiz' },
  { href: routes.ranking, label: 'Classement' },
];

const iconButton =
  'inline-flex size-11 items-center justify-center rounded-full text-brand-light hover:bg-white/10 transition-colors';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return;
    if (mobileMenuOpen) closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  const themeLabel = theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';

  return (
    <header className="on-ink fixed inset-x-0 top-0 z-50 bg-surface-ink/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href={routes.home} aria-label="Aniscanic, accueil" className="inline-flex rounded-lg">
          <AniscanicLogo variant="full" size="md" surface="dark" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(
                    'relative flex h-11 items-center rounded-full px-4 font-medium transition-colors',
                    isActive(href) ? 'text-brand-gold' : 'text-brand-light/80 hover:text-brand-light hover:bg-white/5'
                  )}
                >
                  {label}
                  {isActive(href) && (
                    <span aria-hidden className="absolute inset-x-4 -bottom-0.5 h-1 rounded-full bg-brand-gold" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className={cn(iconButton, 'hidden md:inline-flex', searchOpen && 'bg-white/10')}
            aria-label={searchOpen ? 'Fermer la recherche' : 'Chercher un manga'}
            aria-expanded={searchOpen}
            aria-controls="header-search"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <button type="button" onClick={toggleTheme} className={iconButton} aria-label={themeLabel}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            className={cn(iconButton, 'md:hidden')}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            id="header-search"
            className="hidden overflow-hidden md:block"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="mx-auto max-w-2xl px-6 pb-5">
              <SearchForm inputRef={searchInput} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-brand-dark/70 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(22rem,88vw)] flex-col gap-8 overflow-y-auto bg-surface-ink p-5 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between">
                <AniscanicLogo variant="icon" size="md" surface="dark" />
                <button ref={closeButton} type="button" onClick={() => setMobileMenuOpen(false)} className={iconButton} aria-label="Fermer le menu">
                  <X size={22} />
                </button>
              </div>
              <SearchForm stacked />
              <nav aria-label="Navigation principale">
                <ul className="flex flex-col gap-1">
                  {navLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={isActive(href) ? 'page' : undefined}
                        className={cn(
                          'type-title flex min-h-14 items-center rounded-xl px-4 text-xl transition-colors',
                          isActive(href) ? 'bg-brand-gold text-brand-dark' : 'text-brand-light hover:bg-white/5'
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-auto flex min-h-12 items-center gap-3 rounded-xl px-4 text-brand-light/80 hover:bg-white/5 hover:text-brand-light"
              >
                {theme === 'dark' ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
                {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
