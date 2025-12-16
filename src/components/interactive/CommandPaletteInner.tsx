import { Command } from 'cmdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { commandPaletteData, getShortcutForItem, keyboardShortcuts } from '@/data/commandPalette';
import { type ContentSearchResult, useContentSearch } from '@/hooks/useContentSearch';
import fiverrIcon from '@/icons/social/fiverr.svg?raw';
import githubIcon from '@/icons/social/github.svg?raw';
import linkedinIcon from '@/icons/social/linkedin.svg?raw';
import mailIcon from '@/icons/social/mail.svg?raw';
import upworkIcon from '@/icons/social/upwork.svg?raw';
import whatsappIcon from '@/icons/social/whatsapp.svg?raw';
import folderIcon from '@/icons/ui/folder.svg?raw';
import homeIcon from '@/icons/ui/home.svg?raw';
import newspaperIcon from '@/icons/ui/newspaper.svg?raw';
import searchIcon from '@/icons/ui/search.svg?raw';
import type { CommandItem } from '@/types/commandPalette';
import { HelpDialog } from './HelpDialog';

// Icon maps - defined outside component to avoid recreating on each render
const ICON_MAP: Record<string, string> = {
    home: homeIcon,
    folder: folderIcon,
    newspaper: newspaperIcon,
    search: searchIcon,
    github: githubIcon,
    linkedin: linkedinIcon,
    fiverr: fiverrIcon,
    upwork: upworkIcon,
    whatsapp: whatsappIcon,
    mail: mailIcon
};

const CONTENT_ICON_MAP: Record<string, string> = {
    command: searchIcon,
    projects: folderIcon,
    blog: newspaperIcon,
    tools: searchIcon
};

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    command: 'Commands',
    projects: 'Projects',
    blog: 'Blog Posts',
    tools: 'Tools'
};

// Static styles extracted to avoid recreating on each render
const COMMAND_CONTAINER_STYLES: React.CSSProperties = {
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))'
};

interface CommandPaletteInnerProps {
    lang: string;
    placeholder?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandPaletteInner({
    lang,
    placeholder = 'Type a command or search...',
    isOpen: open,
    onOpenChange: setOpen
}: CommandPaletteInnerProps) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewportHeight, setViewportHeight] = useState<number | null>(null);
    const [viewportOffset, setViewportOffset] = useState(0);
    const commandRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // Cache DOM elements to avoid repeated querySelector calls
    const elementsRef = useRef<{
        main: HTMLElement | null;
        nav: HTMLElement | null;
        footer: HTMLElement | null;
    } | null>(null);

    // Memoized styles for viewport-dependent positioning (avoids object recreation)
    const viewportPositionStyle = useMemo(
        () =>
            viewportHeight
                ? {
                      height: viewportHeight,
                      top: viewportOffset,
                      paddingTop: Math.min(viewportHeight * 0.1, 60)
                  }
                : undefined,
        [viewportHeight, viewportOffset]
    );

    // Memoized style for list max height
    const listMaxHeightStyle = useMemo(
        () => ({
            maxHeight: viewportHeight ? Math.max(viewportHeight * 0.5, 200) : 500
        }),
        [viewportHeight]
    );

    // Track visual viewport changes (for mobile keyboard)
    useEffect(() => {
        if (!open) return;

        const viewport = window.visualViewport;
        if (!viewport) return;

        const updateViewport = () => {
            setViewportHeight(viewport.height);
            setViewportOffset(viewport.offsetTop);
        };

        // Initial update
        updateViewport();

        viewport.addEventListener('resize', updateViewport);
        viewport.addEventListener('scroll', updateViewport);

        return () => {
            viewport.removeEventListener('resize', updateViewport);
            viewport.removeEventListener('scroll', updateViewport);
        };
    }, [open]);

    // Initialize content search
    const { search: searchContent, results: contentResults, groupedResults } = useContentSearch();

    // Handle search query changes
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    // Update search query
    useEffect(() => {
        searchContent(searchQuery);
    }, [searchQuery, searchContent]);

    const navigate = useCallback(
        (path: string) => {
            window.location.href = `/${lang}${path}`;
            setOpen(false);
        },
        [lang, setOpen]
    );

    const openExternal = useCallback(
        (url: string) => {
            window.open(url, '_blank', 'noopener,noreferrer');
            setOpen(false);
        },
        [setOpen]
    );

    const handleAction = useCallback(
        (action: string) => {
            switch (action) {
                case 'showHelp':
                    setOpen(false); // Cierra el command palette
                    setIsHelpOpen(true); // Abre el help dialog
                    break;
                case 'copyUrl':
                    navigator.clipboard.writeText(window.location.href);
                    setOpen(false);
                    break;
                default:
                    break;
            }
        },
        [setOpen]
    );

    // Simple lookup functions using constant maps (no useCallback needed)
    const getIcon = (iconName: string) => ICON_MAP[iconName] ?? searchIcon;

    // Helper function to handle item selection
    const handleItemSelect = useCallback(
        (item: CommandItem) => {
            if (item.href) {
                if (item.external) {
                    openExternal(item.href);
                } else {
                    navigate(item.href);
                }
            } else if (item.action) {
                handleAction(item.action);
            }
        },
        [navigate, openExternal, handleAction]
    );

    // Helper function to handle search result selection
    const handleSearchResultSelect = useCallback(
        (item: ContentSearchResult) => {
            navigate(item.url);
            setOpen(false);
        },
        [navigate, setOpen]
    );

    const getContentIcon = (category: string) => CONTENT_ICON_MAP[category] ?? folderIcon;
    const getCategoryDisplayName = (category: string) =>
        CATEGORY_DISPLAY_NAMES[category] ?? category.charAt(0).toUpperCase() + category.slice(1);

    // Helper functions for HelpDialog
    const handleBackToCommandPalette = useCallback(() => {
        setIsHelpOpen(false);
        setOpen(true);
    }, [setOpen]);

    // Focus management - auto-focus input when opened
    useEffect(() => {
        if (open && inputRef.current) {
            // Small delay to ensure the component is fully rendered
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Apply blur effect to main content when command palette is open
    useEffect(() => {
        // Cache DOM elements on first open (lazy initialization)
        if (!elementsRef.current) {
            elementsRef.current = {
                main: document.querySelector('main'),
                nav: document.querySelector('nav'),
                footer: document.querySelector('footer')
            };
        }
        const { main, nav, footer } = elementsRef.current;

        const applyBlur = (element: HTMLElement | null, blur: boolean) => {
            if (!element) return;
            element.style.filter = blur ? 'blur(4px) brightness(0.7)' : 'none';
            if (blur) element.style.transition = 'filter 0.2s ease-in-out';
        };

        applyBlur(main, open);
        applyBlur(nav, open);
        applyBlur(footer, open);
        document.body.style.overflow = open ? 'hidden' : '';

        return () => {
            applyBlur(main, false);
            applyBlur(nav, false);
            applyBlur(footer, false);
            document.body.style.overflow = '';
        };
    }, [open]);

    // Enhanced keyboard handling with Command/Ctrl support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle keys when command palette is open
            if (!open) return;

            // ESC to close
            if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
                return;
            }

            // Quick navigation shortcuts - Now with Command/Ctrl key requirement
            const inputElement = inputRef.current;
            if (inputElement && document.activeElement === inputElement && inputElement.value === '') {
                const key = e.key.toLowerCase();

                // Check if this is a registered shortcut that requires Command/Ctrl
                if (keyboardShortcuts[key] && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    const shortcut = keyboardShortcuts[key];

                    if (shortcut.type === 'navigation' && shortcut.href) {
                        if (shortcut.external) {
                            openExternal(shortcut.href);
                        } else {
                            navigate(shortcut.href);
                        }
                    } else if (shortcut.type === 'action' && shortcut.action) {
                        handleAction(shortcut.action);
                    }
                    return;
                }
            }

            // Focus input on any printable character if not already focused
            if (
                e.key.length === 1 &&
                !e.ctrlKey &&
                !e.metaKey &&
                !e.altKey &&
                document.activeElement !== inputRef.current
            ) {
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, setOpen, navigate, openExternal, handleAction]);

    // Focus trap - keep focus within the command palette
    useEffect(() => {
        if (!open) return;

        const handleFocusOut = (e: FocusEvent) => {
            const commandElement = commandRef.current;
            if (!commandElement) return;

            // If focus is moving outside the command palette, bring it back
            if (!commandElement.contains(e.relatedTarget as Node)) {
                inputRef.current?.focus();
            }
        };

        document.addEventListener('focusout', handleFocusOut);
        return () => document.removeEventListener('focusout', handleFocusOut);
    }, [open]);

    // Scroll handling - redirect all scroll events to command palette when open
    useEffect(() => {
        if (!open) return;

        const handleWheel = (e: WheelEvent) => {
            // Prevent default scroll behavior on the page
            e.preventDefault();
            e.stopPropagation();

            // Find the scrollable list within the command palette
            const commandList = commandRef.current?.querySelector('[cmdk-list]') as HTMLElement;
            if (commandList) {
                // Apply scroll to the command list with smoother scrolling
                const scrollAmount = e.deltaY;
                commandList.scrollBy({
                    top: scrollAmount,
                    behavior: 'auto' // Use auto for more responsive scrolling
                });
            }
        };

        // Add wheel event listener to the document with passive: false to allow preventDefault
        document.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.removeEventListener('wheel', handleWheel);
        };
    }, [open]);

    return (
        <>
            {open && (
                // biome-ignore lint/a11y/useKeyWithClickEvents: div needs click handler for closing modal on backdrop click
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[10vh]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="command-palette-title"
                    data-testid="command-palette"
                    onClick={() => setOpen(false)}
                    style={viewportPositionStyle}
                >
                    {/* Enhanced Backdrop with better blur */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-lg transition-all duration-300 ease-in-out"
                        aria-hidden="true"
                    />

                    {/* Command Palette - Centered */}
                    {/** biome-ignore lint/a11y/noStaticElementInteractions: div needs click handler for modal backdrop */}
                    {/** biome-ignore lint/a11y/useKeyWithClickEvents: div needs click handler for modal backdrop */}
                    <div
                        className="relative w-full max-w-2xl command-palette-enter"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Command
                            ref={commandRef}
                            className="rounded-lg border overflow-hidden shadow-2xl bg-background backdrop-blur-sm"
                            loop={true}
                            shouldFilter={searchQuery.trim().length === 0} // Only filter when no search query
                            filter={(value, search) => {
                                // If we have search query, disable CMDK filtering completely
                                if (searchQuery.trim().length > 0) {
                                    return 1; // Show everything, our custom search handles filtering
                                }

                                // For regular commands (no search query), use fuzzy matching
                                if (value.toLowerCase().includes(search.toLowerCase())) {
                                    return 1;
                                }

                                return 0;
                            }}
                            style={COMMAND_CONTAINER_STYLES}
                        >
                            <div className="flex items-center border-b border-foreground/10 px-4">
                                <span
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file
                                    dangerouslySetInnerHTML={{ __html: searchIcon }}
                                    className="w-4 h-4 flex-shrink-0 text-foreground-muted [&>svg]:w-full [&>svg]:h-full"
                                    aria-hidden="true"
                                />
                                <Command.Input
                                    ref={inputRef}
                                    placeholder={placeholder}
                                    className="flex-1 px-4 py-4 bg-transparent border-0 outline-none text-foreground placeholder:text-foreground-muted"
                                    aria-label="Search commands"
                                    aria-describedby="command-palette-description"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    value={searchQuery}
                                    onValueChange={handleSearchChange}
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-foreground-muted bg-foreground/5 rounded">
                                        <span className="text-xs">⌘K</span>
                                    </kbd>
                                    <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs text-foreground-muted bg-foreground/5 rounded">
                                        <span className="text-xs">ESC</span>
                                    </kbd>
                                </div>
                            </div>

                            <div id="command-palette-description" className="sr-only">
                                Use arrow keys to navigate, Enter to select, Escape to close
                            </div>

                            <Command.List
                                className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent relative"
                                aria-live="polite"
                                aria-label="Search results"
                                style={listMaxHeightStyle}
                            >
                                {/* Elegant scroll indicator for when there's content */}
                                {(searchQuery.trim().length === 0
                                    ? commandPaletteData.length > 0
                                    : contentResults.length > 0) && (
                                    <div className="absolute top-1 right-1 text-xs text-foreground-muted/60 pointer-events-none opacity-70 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-foreground/10">
                                        ↕
                                    </div>
                                )}
                                {/* Show regular commands only when there's no search query */}
                                {searchQuery.trim().length === 0 &&
                                    commandPaletteData.map((group) => (
                                        <div key={group.heading}>
                                            <Command.Group
                                                heading={group.heading}
                                                className="px-2 pt-2 pb-1 text-xs font-semibold text-foreground-muted"
                                            >
                                                {group.items.map((item: CommandItem) => (
                                                    <Command.Item
                                                        key={item.id}
                                                        value={item.value}
                                                        onSelect={() => handleItemSelect(item)}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
                                                        keywords={item.keywords}
                                                    >
                                                        <span
                                                            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file
                                                            dangerouslySetInnerHTML={{ __html: getIcon(item.icon) }}
                                                            aria-hidden="true"
                                                            className="w-4 h-4 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full"
                                                        />
                                                        <span>
                                                            {item.label ||
                                                                item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                                                        </span>
                                                        <kbd className="ml-auto text-xs text-foreground-muted">
                                                            {getShortcutForItem(item) || ''}
                                                        </kbd>
                                                    </Command.Item>
                                                ))}
                                            </Command.Group>
                                            {/* Add separator between groups except the last one */}
                                            {group !== commandPaletteData[commandPaletteData.length - 1] && (
                                                <Command.Separator className="my-2 h-px bg-foreground/10" />
                                            )}
                                        </div>
                                    ))}

                                {/* Content Search Results - Show when there's a search query */}
                                {searchQuery.trim().length > 0 && (
                                    <div>
                                        {contentResults.length > 0 ? (
                                            // Render grouped results by category
                                            Object.entries(groupedResults).map(([category, items], index) => (
                                                <div key={category}>
                                                    <Command.Group
                                                        heading={getCategoryDisplayName(category)}
                                                        className="px-2 pt-2 pb-1 text-xs font-semibold text-foreground-muted"
                                                    >
                                                        {items.map((item: ContentSearchResult) => (
                                                            <Command.Item
                                                                key={`${item.category}-${item.title}`}
                                                                value={`content:${item.title}`}
                                                                onSelect={() => handleSearchResultSelect(item)}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
                                                            >
                                                                <span
                                                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: getContentIcon(item.category)
                                                                    }}
                                                                    aria-hidden="true"
                                                                    className="w-4 h-4 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium truncate">
                                                                        {item.title}
                                                                    </div>
                                                                    <div className="text-xs text-foreground-muted truncate">
                                                                        {item.description}
                                                                    </div>
                                                                </div>
                                                                <kbd className="ml-auto text-xs text-foreground-muted">
                                                                    {item.type === 'command' ? '⌘' : '📄'}
                                                                </kbd>
                                                            </Command.Item>
                                                        ))}
                                                    </Command.Group>
                                                    {/* Add separator between groups except the last one */}
                                                    {index < Object.entries(groupedResults).length - 1 && (
                                                        <Command.Separator className="my-2 h-px bg-foreground/10" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center text-sm text-foreground-muted">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-2xl">🔍</span>
                                                    <p>No se encontraron resultados para "{searchQuery}"</p>
                                                    <p className="text-xs text-[rgb(var(--color-text-muted-gray))]">
                                                        Tip: Intenta palabras clave más generales
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Command.List>
                        </Command>
                    </div>
                </div>
            )}

            {/* Help Dialog */}
            <HelpDialog isOpen={isHelpOpen} onBackToCommandPalette={handleBackToCommandPalette} />
        </>
    );
}
