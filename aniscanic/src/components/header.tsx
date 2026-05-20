'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BookOpen, Brain, Menu, Moon, Search, Sun, Trophy, Video, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { routes } from '@/constants';
import { AniscanicLogo } from '@/components/ui/logo';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: routes.manga, icon: BookOpen, label: 'Scan' },
  { href: routes.movie, icon: Video, label: 'Movies' },
  { href: routes.quiz, icon: Brain, label: 'Quiz' },
  { href: routes.ranking, icon: Trophy, label: 'Classement' },
];

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header>
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-brand-dark/95 backdrop-blur-md shadow-nav"
            : "bg-transparent backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link href={routes.home} className="inline-flex">
              <AniscanicLogo variant="full" size="md" colorMode="gradient" concept="shuriken" />
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center space-x-1 transition-colors duration-200",
                    pathname === href
                      ? "text-brand-gold"
                      : "text-white hover:text-brand-gold"
                  )}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-white hover:bg-brand-gold/20 rounded-full transition-colors duration-200"
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                className="p-2 text-white hover:bg-brand-gold/20 rounded-full transition-colors duration-200"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>
              <button
                className="md:hidden p-2 text-white hover:bg-brand-gold/20 rounded-full transition-colors duration-200"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-brand-dark/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-72 bg-brand-dark p-6 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-label="Menu de navigation"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:bg-brand-gold/20 rounded-full transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                {navLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center space-x-3 text-lg transition-colors duration-200",
                      pathname === href
                        ? "text-brand-gold"
                        : "text-white hover:text-brand-gold"
                    )}
                  >
                    <Icon size={22} />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-8 border-t border-white/10">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 text-white hover:text-brand-gold transition-colors duration-200"
                >
                  {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                  <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;