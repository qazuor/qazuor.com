import { useCallback, useEffect, useRef, useState } from 'react';

interface GoodieItem {
    slug: string;
    title: string;
    icon?: string;
}

interface GoodiesCategory {
    id: 'tools' | 'snippets' | 'css-tricks' | 'useful-links';
    title: string;
    items: GoodieItem[];
    viewAllLabel: string;
    viewAllHref: string;
}

interface GoodiesDropdownProps {
    currentLocale: string;
    currentPath: string;
    triggerLabel: string;
    categories: GoodiesCategory[];
    translations: {
        headerTitle: string;
        headerDescription: string;
        viewAllLabel: string;
    };
}

const categoryIcons: Record<string, string> = {
    tools: '🛠️',
    snippets: '📝',
    'css-tricks': '🎨',
    'useful-links': '🔗'
};

/**
 * Goodies dropdown with categorized sections
 * Shows Tools, Snippets, CSS Tricks, and Useful Links in vertical sections
 */
export function GoodiesDropdown({
    currentLocale,
    currentPath,
    triggerLabel,
    categories,
    translations
}: GoodiesDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSetIsOpen = useCallback((value: boolean) => {
        setIsOpen(value);
    }, []);

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
            handleSetIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            handleSetIsOpen(false);
        }
    };

    const isGoodiesActive = currentPath.includes('/goodies');

    // Show all categories (even without items, show at least "View All" link)
    const categoriesWithItems = categories;

    if (!mounted) {
        return (
            <div className="relative">
                <span className="nav-link text-[0.65rem] font-medium font-mono whitespace-nowrap text-foreground-secondary">
                    {triggerLabel}
                </span>
            </div>
        );
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: div with role="group" is semantically correct for dropdown containers
        <div
            ref={dropdownRef}
            className="relative"
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
                    isGoodiesActive ? 'text-primary' : 'text-foreground-secondary hover:text-foreground'
                }`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label={`${triggerLabel} menu`}
            >
                {triggerLabel}
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
                        isGoodiesActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label={`${triggerLabel} menu`}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-[520px] rounded-lg border border-foreground/[0.06] overflow-visible z-[100] shadow-lg bg-background dark:bg-card animate-slideInDropdownCentered"
                >
                    {/* Arrow/Triangle Indicator */}
                    <div
                        className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-8 h-[14px] overflow-hidden"
                        aria-hidden="true"
                    >
                        <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-5 h-5 rotate-45 bg-background dark:bg-card border-l border-t border-foreground/[0.06]" />
                    </div>

                    {/* Header */}
                    <div className="px-4 pt-4 pb-3 border-b border-foreground/[0.06]">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                            {translations.headerTitle}
                        </h3>
                        <p className="text-[0.75rem] text-foreground-secondary/70 mt-1 leading-relaxed">
                            {translations.headerDescription}
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {categoriesWithItems.map((category, catIndex) => (
                            <div
                                key={category.id}
                                className={`px-4 py-3 ${catIndex < categoriesWithItems.length - 1 ? 'border-b border-foreground/[0.06]' : ''}`}
                            >
                                {/* Category Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-[0.75rem] font-semibold text-foreground flex items-center gap-1.5">
                                        <span aria-hidden="true">{categoryIcons[category.id]}</span>
                                        {category.title}
                                    </h4>
                                    <a
                                        href={category.viewAllHref}
                                        className="text-[0.65rem] text-primary hover:text-primary/80 transition-colors"
                                        onClick={() => handleSetIsOpen(false)}
                                    >
                                        {category.viewAllLabel} →
                                    </a>
                                </div>

                                {/* Items Grid - only show for categories with individual pages and items */}
                                {category.id !== 'useful-links' && category.items.length > 0 && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {category.items.slice(0, 4).map((item) => (
                                            <a
                                                key={item.slug}
                                                href={`/${currentLocale}/goodies/${category.id}/${item.slug}`}
                                                role="menuitem"
                                                className="flex items-center gap-2 px-2 py-1.5 text-[0.75rem] rounded-md hover:bg-foreground/[0.06] hover:scale-[1.01] transition-all duration-200 text-foreground-secondary hover:text-foreground"
                                                onClick={() => handleSetIsOpen(false)}
                                            >
                                                {item.icon && (
                                                    <span className="text-sm opacity-60" aria-hidden="true">
                                                        {item.icon}
                                                    </span>
                                                )}
                                                <span className="truncate">{item.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                                {/* For useful-links, show items as labels (only if there are items) */}
                                {category.id === 'useful-links' && category.items.length > 0 && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {category.items.slice(0, 4).map((item) => (
                                            <span
                                                key={item.slug}
                                                className="flex items-center gap-2 px-2 py-1.5 text-[0.75rem] rounded-md text-foreground-secondary/60"
                                            >
                                                {item.icon && (
                                                    <span className="text-sm opacity-60" aria-hidden="true">
                                                        {item.icon}
                                                    </span>
                                                )}
                                                <span className="truncate">{item.title}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Show message if no categories at all */}
                        {categories.length === 0 && (
                            <div className="px-4 py-6 text-center text-foreground-secondary text-sm">
                                Coming soon...
                            </div>
                        )}
                    </div>

                    {/* View All Goodies Link */}
                    <div className="border-t border-foreground/[0.06] p-3">
                        <a
                            href={`/${currentLocale}/goodies`}
                            className="flex items-center justify-between px-3 py-2 text-[0.8125rem] rounded-md hover:bg-foreground/[0.06] hover:scale-[1.02] transition-all duration-200 text-foreground-secondary hover:text-foreground font-medium"
                            onClick={() => handleSetIsOpen(false)}
                        >
                            <span>{translations.viewAllLabel}</span>
                            <svg
                                className="w-4 h-4 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
