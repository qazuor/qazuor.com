import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Card component for content containers
 * Supports hover effects
 */
export function Card({ children, hover = false, className, onClick }: CardProps) {
  const classes = clsx(hover ? 'card-hover' : 'card', onClick && 'cursor-pointer', className);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  // Build props conditionally
  const interactiveProps = onClick
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        role: 'button' as const,
        tabIndex: 0,
      }
    : {};

  return (
    <div className={classes} {...interactiveProps}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={clsx('mb-4', className)}>{children}</div>;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={clsx('text-xl font-semibold', className)}>{children}</h3>;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx('text-foreground-secondary', className)}>{children}</div>;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={clsx('mt-4 flex gap-2', className)}>{children}</div>;
}
