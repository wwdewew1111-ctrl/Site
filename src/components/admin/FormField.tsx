import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-sm text-error-700 dark:text-error-500">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}
