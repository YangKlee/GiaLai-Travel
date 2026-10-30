import { cva } from 'class-variance-authority';

export const buttonVariants = cva('button', {
  variants: { variant: { primary: 'button-primary', secondary: 'button-secondary', ghost: 'button-ghost' } },
  defaultVariants: { variant: 'primary' },
});
