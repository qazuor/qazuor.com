import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface NavDropdownItem {
    id: string;
    label: string;
    icon?: ReactNode;
    href: string;
    description?: string;
}

interface NavDropdownProps {
    /** Trigger button label */
    label: string;
    /** Dropdown menu items */
    items: NavDropdownItem[];
    /** Whether the current route is within this dropdown's scope */
    isActive?: boolean;
    /** Optional className for customization */
    className?: string;
    /** Callback when dropdown state changes */
    onOpenChange?: (isOpen: boolean) => void;
    /** Layout variant: 'list' (vertical single column) or 'grid' (2-column grid like Josh Comeau) */
    variant?: 'list' | 'grid';
    /** Optional header with title and description */
    header?: {
        title?: string;
        description?: string;
    };
    /** Show "View All" link separately from grid items */
    viewAllLink?: {
        label: string;
        href: string;
    };
}

/**
 * Generic navigation dropdown component
 * Supports hover, click, and keyboard navigation
 * Reusable for any navigation dropdown needs
 */
export function NavDropdown({
    label,
    items,
    isActive = false,
    className = '',
    onOpenChange,
    variant = 'list',
    header,
    viewAllLink
}: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSetIsOpen = useCallback(
        (value: boolean) => {
            setIsOpen(value);
            onOpenChange?.(value);
        },
        [onOpenChange]
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handleSetIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleSetIsOpen]);

    // Auto-focus menu item when focusedIndex changes
    useEffect(() => {
        if (focusedIndex >= 0 && focusedIndex < menuItemRefs.current.length) {
            menuItemRefs.current[focusedIndex]?.focus();
        }
    }, [focusedIndex]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        handleSetIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            handleSetIsOpen(false);
        }, 200);
    };

    const handleClick = () => {
        handleSetIsOpen(!isOpen);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isOpen) {
                handleSetIsOpen(true);
                setFocusedIndex(0);
            }
        } else if (e.key === 'Escape') {
            handleSetIsOpen(false);
            setFocusedIndex(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                handleSetIsOpen(true);
                setFocusedIndex(0);
            } else {
                setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (isOpen) {
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            }
        }
    };

    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            handleSetIsOpen(false);
            setFocusedIndex(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Tab') {
            // Allow normal tab behavior but close menu
            handleSetIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    if (!mounted) {
        return (
            <div className={`relative ${className}`}>
                <span className="nav-link text-[0.65rem] font-medium font-mono whitespace-nowrap text-foreground-secondary">
                    {label}
                </span>
            </div>
        );
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: div with role="group" is semantically correct for dropdown containers
        <div
            ref={dropdownRef}
            className={`relative ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="group"
        >
            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className={`nav-link text-[0.65rem] font-medium font-mono whitespace-nowrap transition-all duration-base relative group flex items-center gap-1 ${
                    isActive ? 'text-primary' : 'text-foreground-secondary hover:text-foreground'
                }`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label={`${label} menu`}
            >
                {label}
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {/* Underline animation */}
                <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-base ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label={`${label} menu`}
                    onKeyDown={handleMenuKeyDown}
                    className={`
                        absolute top-full border border-foreground/[0.06] overflow-visible z-[100]
                        shadow-lg
                        bg-background dark:bg-card
                        ${
                            variant === 'grid'
                                ? 'w-[480px] rounded-lg left-1/2 -translate-x-1/2 mt-8 animate-slideInDropdownCentered'
                                : 'w-52 rounded-lg left-0 mt-3 animate-slideInDropdown'
                        }
                    `}
                >
                    {/* Arrow/Triangle Indicator - only for grid variant */}
                    {variant === 'grid' && (
                        <div
                            className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-8 h-[14px] overflow-hidden"
                            aria-hidden="true"
                        >
                            <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-5 h-5 rotate-45 bg-background dark:bg-card border-l border-t border-foreground/[0.06]" />
                        </div>
                    )}
                    {/* Header (if provided) */}
                    {header && (header.title || header.description) && (
                        <div className="px-4 pt-4 pb-3 border-b border-foreground/[0.06]">
                            {header.title && (
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                                    {header.title}
                                </h3>
                            )}
                            {header.description && (
                                <p className="text-[0.75rem] text-foreground-secondary/70 mt-1 leading-relaxed">
                                    {header.description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Grid Items */}
                    <div className={variant === 'grid' ? 'grid grid-cols-2 gap-1 p-3' : 'flex flex-col'}>
                        {items.map((item, index) => (
                            <a
                                key={item.id}
                                ref={(el) => {
                                    menuItemRefs.current[index] = el;
                                }}
                                href={item.href}
                                role="menuitem"
                                tabIndex={focusedIndex === index ? 0 : -1}
                                className={`
                                    flex items-center gap-2 transition-all duration-fast
                                    ${
                                        variant === 'grid'
                                            ? 'px-3 py-2 text-[0.8125rem] rounded-md hover:bg-foreground/[0.06] hover:scale-subtle focus:bg-foreground/[0.06] focus:outline-none focus:ring-2 focus:ring-primary/20'
                                            : 'px-3 py-2 text-[0.65rem] hover:bg-foreground/5'
                                    }
                                    ${
                                        index === 0 && variant === 'list'
                                            ? 'font-medium text-foreground border-b border-foreground/10'
                                            : 'font-normal text-foreground-secondary hover:text-foreground'
                                    }
                                `}
                                onClick={() => handleSetIsOpen(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        window.location.href = item.href;
                                    }
                                }}
                            >
                                {item.icon && (
                                    <span className="flex-shrink-0 text-primary/80" aria-hidden="true">
                                        {item.icon}
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div
                                        className={`${variant === 'grid' ? 'text-[0.8125rem] leading-snug font-normal break-words' : ''}`}
                                    >
                                        {item.label}
                                    </div>
                                    {item.description && (
                                        <div className="text-[10px] text-foreground-secondary/70 mt-0.5">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* View All Link (if provided) */}
                    {viewAllLink && (
                        <div className="border-t border-foreground/[0.06] p-3">
                            <a
                                href={viewAllLink.href}
                                className="flex items-center justify-between px-3 py-2 text-[0.8125rem] rounded-md hover:bg-foreground/[0.06] hover:scale-subtle transition-all duration-200 text-foreground-secondary hover:text-foreground font-medium focus:bg-foreground/[0.06] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                onClick={() => handleSetIsOpen(false)}
                            >
                                <span>{viewAllLink.label}</span>
                                <svg
                                    className="w-4 h-4 opacity-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
