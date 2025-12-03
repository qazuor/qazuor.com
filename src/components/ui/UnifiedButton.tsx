import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface UnifiedButtonProps {
    /** Button content */
    children: ReactNode;

    /** Visual style variant */
    variant?: ButtonVariant;

    /** Button size */
    size?: ButtonSize;

    /** Icon element (SVG component or raw HTML string) */
    icon?: ReactNode;

    /** Icon position relative to text */
    iconPosition?: 'left' | 'right';

    /** Render as icon-only button (no text padding) */
    iconOnly?: boolean;

    /** Disabled state */
    disabled?: boolean;

    /** Loading state - shows spinner and disables button */
    loading?: boolean;

    /** Active/selected state (for toggles, pagination) */
    active?: boolean;

    /** Full width button */
    fullWidth?: boolean;

    /** Render as anchor tag */
    href?: string;

    /** Link target (only when href is provided) */
    target?: '_blank' | '_self' | '_parent' | '_top';

    /** Button type (only when not href) */
    type?: 'button' | 'submit' | 'reset';

    /** Click handler */
    onClick?: () => void;

    /** Additional CSS classes */
    className?: string;

    /** Accessible label */
    ariaLabel?: string;
}

/**
 * Unified Button Component
 *
 * A single, configurable button component for consistent styling across the site.
 * Supports multiple variants, sizes, icons, and can render as button or anchor.
 *
 * @example
 * // Primary CTA
 * <UnifiedButton variant="primary" size="lg">View Projects</UnifiedButton>
 *
 * // With icon
 * <UnifiedButton variant="secondary" icon={<ArrowIcon />} iconPosition="right">
 *   Next Page
 * </UnifiedButton>
 *
 * // As link
 * <UnifiedButton href="/blog" variant="ghost">Read More</UnifiedButton>
 *
 * // Icon only
 * <UnifiedButton iconOnly icon={<MenuIcon />} ariaLabel="Open menu" />
 */
export function UnifiedButton({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    iconOnly = false,
    disabled = false,
    loading = false,
    active = false,
    fullWidth = false,
    href,
    target,
    type = 'button',
    onClick,
    className,
    ariaLabel
}: UnifiedButtonProps) {
    const isDisabled = disabled || loading;

    // Determine if we have an icon to show
    const hasIcon = !!icon || loading;

    // Base classes
    const baseClasses = clsx(
        // Layout
        'group inline-flex items-center justify-center',
        // Typography
        'font-semibold',
        // Shape
        'rounded-xl',
        // Transitions
        'transition-all duration-300',
        // Focus
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    );

    // Variant classes
    const variantClasses: Record<ButtonVariant, string> = {
        primary: clsx(
            'relative overflow-hidden text-white shadow-lg shadow-[#667eea]/30',
            'bg-[linear-gradient(135deg,#667eea_0%,#814ba2_100%)]',
            'before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#8b7ec8_0%,#5a4fcf_100%)]',
            'before:opacity-0 before:transition-opacity before:duration-500 before:ease-in-out',
            !isDisabled && 'hover:before:opacity-100'
        ),
        secondary: clsx(
            'relative overflow-hidden border text-foreground',
            'bg-[linear-gradient(135deg,rgba(102,126,234,0.08)_0%,rgba(129,75,162,0.08)_100%)]',
            'border-[#667eea]/20 shadow-md shadow-[#667eea]/10',
            'before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#667eea_0%,#814ba2_100%)]',
            'before:opacity-0 before:transition-opacity before:duration-500 before:ease-in-out',
            !isDisabled &&
                'hover:before:opacity-100 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-[#667eea]/30 hover:-translate-y-0.5'
        ),
        ghost: clsx(
            'relative overflow-hidden text-[#667eea]',
            'bg-[linear-gradient(135deg,rgba(102,126,234,0.05)_0%,rgba(129,75,162,0.05)_100%)]',
            'before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#667eea_0%,#814ba2_100%)]',
            'before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out',
            !isDisabled && 'hover:before:opacity-15 hover:text-[#5a4fcf]'
        ),
        outline: clsx(
            'relative overflow-hidden border-2 text-[#667eea]',
            'bg-transparent border-[#667eea]/50',
            'shadow-md shadow-[#667eea]/15',
            'before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#667eea_0%,#814ba2_100%)]',
            'before:opacity-0 before:transition-opacity before:duration-500 before:ease-in-out',
            !isDisabled &&
                'hover:before:opacity-100 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-[#667eea]/30 hover:-translate-y-0.5'
        )
    };

    // Size classes
    const sizeClasses: Record<ButtonSize, string> = {
        xs: iconOnly ? 'p-1.5 text-xs' : 'px-3 py-1.5 text-xs',
        sm: iconOnly ? 'p-2 text-sm' : 'px-4 py-2 text-sm',
        md: iconOnly ? 'p-2.5 text-base' : 'px-6 py-3 text-base',
        lg: iconOnly ? 'p-3 text-lg' : 'px-8 py-4 text-lg'
    };

    // State classes
    const stateClasses = clsx(
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        active && 'bg-[linear-gradient(135deg,#667eea_0%,#814ba2_100%)] text-white shadow-lg shadow-[#667eea]/30',
        fullWidth && 'w-full'
    );

    const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], stateClasses, className);

    // Icon sizing based on button size
    const iconSizeClasses: Record<ButtonSize, string> = {
        xs: 'w-3.5 h-3.5',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-5 h-5'
    };

    // Render icon with proper sizing
    const renderIcon = (position: 'left' | 'right') => {
        if (!icon || iconPosition !== position) return null;

        const iconTransform =
            position === 'left'
                ? 'group-hover:-translate-x-0.5 transition-transform'
                : 'group-hover:translate-x-0.5 transition-transform';

        return (
            <span className={clsx(iconSizeClasses[size], iconTransform, '[&>svg]:w-full [&>svg]:h-full')}>{icon}</span>
        );
    };

    // Loading spinner (decorative, hidden from assistive technology)
    const spinner = (
        <svg className={clsx(iconSizeClasses[size], 'animate-spin')} fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    const content = (
        <span
            className={clsx('relative z-10 inline-flex items-center justify-center', hasIcon && !iconOnly && 'gap-2')}
        >
            {loading ? spinner : renderIcon('left')}
            {!iconOnly && children}
            {!loading && renderIcon('right')}
        </span>
    );

    // Render as anchor if href is provided
    if (href) {
        return (
            <a
                href={href}
                className={classes}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                aria-label={ariaLabel}
                aria-disabled={isDisabled || undefined}
            >
                {content}
            </a>
        );
    }

    // Render as button
    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={isDisabled}
            aria-label={ariaLabel}
            aria-disabled={isDisabled || undefined}
        >
            {content}
        </button>
    );
}
