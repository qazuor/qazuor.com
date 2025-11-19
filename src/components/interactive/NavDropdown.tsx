import { useCallback, useEffect, useRef, useState } from 'react';

export interface NavDropdownItem {
    id: string;
    label: string;
    icon?: string;
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
}

/**
 * Generic navigation dropdown component
 * Supports hover, click, and keyboard navigation
 * Reusable for any navigation dropdown needs
 */
export function NavDropdown({ label, items, isActive = false, className = '', onOpenChange }: NavDropdownProps) {
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
                    className="absolute top-full left-0 mt-2 w-52 rounded-lg bg-card border border-foreground/10 shadow-lg overflow-hidden z-[100] opacity-100 translate-y-0 transition-all duration-200"
                >
                    {items.map((item, index) => (
                        <a
                            key={item.id}
                            ref={(el) => {
                                menuItemRefs.current[index] = el;
                            }}
                            href={item.href}
                            role="menuitem"
                            tabIndex={focusedIndex === index ? 0 : -1}
                            className={`flex items-center gap-2.5 px-3 py-2 text-[0.65rem] text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors ${
                                index === 0
                                    ? 'font-medium text-foreground border-b border-foreground/10'
                                    : 'font-normal'
                            }`}
                            onClick={() => handleSetIsOpen(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    window.location.href = item.href;
                                }
                            }}
                        >
                            {item.icon && (
                                <span className="text-lg opacity-80" aria-hidden="true">
                                    {item.icon}
                                </span>
                            )}
                            <div className="flex-1">
                                <div>{item.label}</div>
                                {item.description && (
                                    <div className="text-[10px] text-foreground-secondary/70 mt-0.5">
                                        {item.description}
                                    </div>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
