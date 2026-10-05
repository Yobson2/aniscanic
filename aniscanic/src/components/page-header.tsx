import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  /** Controls under the subtitle (search form, filters) */
  children?: React.ReactNode;
  /** Optional right-hand column on wide screens */
  aside?: React.ReactNode;
}

/** Ink band that opens every section page, continuous with the fixed header above it. */
export default function PageHeader({ title, subtitle, children, aside }: PageHeaderProps) {
  return (
    <div className="on-ink bg-surface-ink text-brand-light">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-28 md:px-6 md:pb-16 md:pt-36 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <h1 className="type-display mb-4 text-[clamp(2.25rem,4vw+1rem,4rem)]">{title}</h1>
          <p className="max-w-2xl text-lg text-brand-light/75 md:text-xl">{subtitle}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside}
      </div>
    </div>
  );
}
