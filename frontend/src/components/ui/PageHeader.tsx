import React from 'react';

interface PageHeaderProps {
  title: string;
  titleKn?: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHeader({ title, titleKn, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-8 text-center max-w-3xl mx-auto">
      {badge && (
        <span className="inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
          {badge}
        </span>
      )}
      {titleKn && (
        <p className="text-amber-400 text-sm md:text-base font-kannada font-semibold mb-1">
          {titleKn}
        </p>
      )}
      <h1 className="text-3xl md:text-5xl font-display font-bold text-cream mb-2 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs md:text-sm text-cream/70 leading-relaxed font-light">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
    </div>
  );
}
