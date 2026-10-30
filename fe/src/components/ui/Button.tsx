import type { ButtonHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buttonVariants } from './button-variants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ variant, className, loading = false, disabled, children, type = 'button', ...props }: ButtonProps) {
  return <button type={type} disabled={disabled || loading} aria-busy={loading} className={cn(buttonVariants({ variant }), className)} {...props}>
    {loading ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : null}{children}
  </button>;
}
