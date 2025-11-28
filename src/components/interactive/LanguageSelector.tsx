import { navigate } from 'astro:transitions/client';
import { useEffect, useRef, useState } from 'react';

interface LanguageSelectorProps {
    currentLocale: string;
    compact?: boolean;
}

/**
 * Language selector component
 * Switches between available languages
 *
 * @param currentLocale - Current selected language
 * @param compact - When true, shows a globe icon with dropdown instead of both flags
 */
export function LanguageSelector({ currentLocale, compact = false }: LanguageSelectorProps) {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!compact) return;

        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [compact]);

    const languages = [
        { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
        { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' }
    ];

    const changeLanguage = (locale: string) => {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        // Remove existing locale prefix (en or es)
        const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '');

        // Add new locale prefix and preserve hash
        const newPath = `/${locale}${pathWithoutLocale || '/'}${currentHash}`;

        // Use Astro's official navigate() API for programmatic navigation
        // This will trigger View Transitions automatically
        navigate(newPath);
    };

    if (!mounted) {
        return (
            <div className="language-selector p-2 rounded-lg bg-muted">
                <div className="w-12 h-5" />
            </div>
        );
    }

    // Compact mode: Globe icon with dropdown
    if (compact) {
        return (
            <div className="language-selector relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    aria-label="Select language"
                    aria-expanded={isOpen}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        role="img"
                        aria-label="Language icon"
                    >
                        <title>Language</title>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-32 rounded-lg bg-card border border-border shadow-lg z-50 overflow-hidden">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                                    currentLocale === lang.code
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground-secondary hover:bg-muted'
                                }`}
                                aria-label={`Switch to ${lang.name}`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Default mode: Both flags visible (no text labels)
    return (
        <div className="language-selector flex gap-1 p-1 rounded-lg bg-muted">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-base transition-all ${
                        currentLocale === lang.code
                            ? 'bg-primary/20 ring-2 ring-primary/50 scale-110'
                            : 'opacity-40 grayscale hover:opacity-80 hover:grayscale-0'
                    }`}
                    aria-label={`Switch to ${lang.name}`}
                >
                    {lang.flag}
                </button>
            ))}
        </div>
    );
}
