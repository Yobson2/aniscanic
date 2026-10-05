import React from 'react';
import { Search } from 'lucide-react';
import { routes } from '@/constants';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  inputRef?: React.Ref<HTMLInputElement>;
  defaultValue?: string;
  /** "ink" sits on dark surfaces in both themes; "page" follows the page theme */
  surface?: 'ink' | 'page';
  /** Stack the input and button (narrow containers) */
  stacked?: boolean;
  className?: string;
}

/** GET form to the library: works without JavaScript and keeps result URLs shareable. */
export default function SearchForm({ inputRef, defaultValue, surface = 'ink', stacked, className }: SearchFormProps) {
  return (
    <form
      action={routes.manga}
      role="search"
      className={cn('flex gap-2', stacked ? 'flex-col' : 'flex-col sm:flex-row', className)}
    >
      <label className="relative flex-1">
        <span className="sr-only">Titre du manga</span>
        <Search
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2',
            surface === 'ink' ? 'text-white/55' : 'text-muted-foreground'
          )}
          size={20}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Titre du manga"
          className={cn(
            'h-14 w-full rounded-xl pl-12 pr-4 text-base',
            surface === 'ink'
              ? 'bg-white/10 text-brand-light placeholder:text-white/55 focus:bg-white/15'
              : 'bg-card text-foreground shadow-card placeholder:text-muted-foreground'
          )}
        />
      </label>
      <button
        type="submit"
        className="h-14 shrink-0 rounded-xl bg-brand-red px-6 font-semibold text-brand-dark transition-colors hover:bg-brand-gold"
      >
        Chercher
      </button>
    </form>
  );
}
