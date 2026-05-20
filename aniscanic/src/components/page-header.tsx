import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-brand-red to-brand-gold pt-28 pb-12 md:py-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">{title}</h1>
        <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
