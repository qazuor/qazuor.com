import { navigate } from 'astro:transitions/client';
import { Gift, Languages, Moon, Plus, SquareTerminal, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface MobileUtilitiesPopoverProps {
    currentLocale: string;
    translations: {
        goodies: string;
        command: string;
        theme: string;
        language: string;
    };
}

export function MobileUtilitiesPopover({ currentLocale, translations }: MobileUtilitiesPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({
        bottom: 0,
        left: 0
    });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Calculate popover position when opening (arrow points to button center)
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const popoverWidth = 52; // Vertical popover is narrower

            // Center popover horizontally on the button
            const buttonCenter = buttonRect.left + buttonRect.width / 2;
            const leftPosition = buttonCenter - popoverWidth / 2;

            setPopoverPosition({
                bottom: window.innerHeight - buttonRect.top + 12,
                left: leftPosition
            });
        }

        // Dispatch event to notify ScrollToTop
        window.dispatchEvent(new CustomEvent('mobilePopoverChange', { detail: { isOpen } }));
    }, [isOpen]);

    // Initialize theme state from document
    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        updateTheme();

        // Listen for theme changes
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                popoverRef.current &&
                !popoverRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const toggleTheme = useCallback(() => {
        // Dispatch custom event for theme toggle (handled by ThemeToggle script)
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
        setIsDark(!isDark);
        setIsOpen(false);
    }, [isDark]);

    const openCommandPalette = useCallback(() => {
        // Dispatch custom event to open command palette
        window.dispatchEvent(new CustomEvent('openCommandPalette'));
        setIsOpen(false);
    }, []);

    const switchLanguage = useCallback(() => {
        const newLocale = currentLocale === 'es' ? 'en' : 'es';
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        // Replace current locale with new locale in path
        const newPath = currentPath.replace(new RegExp(`^/${currentLocale}`), `/${newLocale}`);
        // Use View Transitions for language switch (preserve query params and hash)
        navigate(`${newPath || `/${newLocale}`}${currentSearch}${currentHash}`);
    }, [currentLocale]);

    return (
        <>
            {/* Trigger Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="More options"
                aria-expanded={isOpen}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    isOpen ? 'bg-primary/20 text-primary' : 'text-muted-foreground active:bg-primary/10'
                }`}
            >
                <Plus size={16} />
            </button>

            {/* Popover - Rendered via Portal to escape nav's transform */}
            {isOpen &&
                createPortal(
                    <div
                        ref={popoverRef}
                        className="fixed z-[500] rounded-xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur-sm dark:border-white/10 dark:shadow-black/20"
                        style={{
                            bottom: popoverPosition.bottom,
                            left: popoverPosition.left
                        }}
                    >
                        {/* Arrow - centered at bottom */}
                        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-r border-b border-border" />

                        <div className="flex flex-col gap-1">
                            {/* Theme Toggle */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={translations.theme}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Language Selector */}
                            <button
                                type="button"
                                onClick={switchLanguage}
                                aria-label={translations.language}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
                            >
                                <Languages size={20} />
                            </button>

                            {/* Command Palette */}
                            <button
                                type="button"
                                onClick={openCommandPalette}
                                aria-label={translations.command}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
                            >
                                <SquareTerminal size={20} />
                            </button>

                            {/* Goodies Link */}
                            <a
                                href={`/${currentLocale}/goodies`}
                                aria-label={translations.goodies}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Gift size={20} />
                            </a>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
