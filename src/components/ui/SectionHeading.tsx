import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </p>
        {title && <h2 className="text-3xl text-text sm:text-4xl lg:text-5xl">{title}</h2>}
        {description && <p className="mt-4 text-base text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
