import type { ReactNode } from 'react';

interface AdminToolbarProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function AdminToolbar({ title, description, action }: AdminToolbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl text-text sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
