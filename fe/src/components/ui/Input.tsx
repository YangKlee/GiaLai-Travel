import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, ...props }: InputProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="form-field">
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${fieldId}-message` : undefined}
        {...props}
      />
      {error || hint ? (
        <p id={`${fieldId}-message`} className={error ? 'field-error' : 'muted'}>
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}
