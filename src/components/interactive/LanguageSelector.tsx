import { navigate } from 'astro:transitions/client';
import { useEffect, useRef, useState } from 'react';

interface LanguageSelectorProps {
    currentLocale: string;
    compact?: boolean;
}

const languages = [
    { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' }
];

/**
 * Language selector component
 * Switches between available languages
 *
 * Optimized for hydration: SSR and client render identical HTML,
 * allowing use of client:idle without hydration mismatch errors.
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
        if (!compact || !mounted) return;

        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [compact, mounted]);

    const changeLanguage = (locale: string) => {
        if (!mounted) return; // Guard for SSR safety

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

    const handleToggleDropdown = () => {
        if (!mounted) return;
        setIsOpen(!isOpen);
    };

    const handleLanguageSelect = (locale: string) => {
        if (!mounted) return;
        changeLanguage(locale);
        setIsOpen(false);
    };

    // Compact mode: Current language code with dropdown
    if (compact) {
        const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];
        const otherLang = languages.find((l) => l.code !== currentLocale) || languages[1];

        return (
            <div className="language-selector relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={handleToggleDropdown}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
                    aria-label="Select language"
                    aria-expanded={isOpen}
                >
                    <span className="text-xs">{currentLang.flag}</span>
                    <span className="uppercase">{currentLang.label}</span>
                    <svg
                        className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 min-w-max rounded-lg bg-card border border-border shadow-lg z-50 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => handleLanguageSelect(otherLang.code)}
                            className="w-full px-3 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 text-foreground-secondary hover:bg-muted whitespace-nowrap"
                            aria-label={`Switch to ${otherLang.name}`}
                        >
                            <span className="text-xs">{otherLang.flag}</span>
                            <span className="uppercase font-semibold">{otherLang.label}</span>
                            <span className="text-foreground-secondary/60 text-xs">({otherLang.name})</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Default mode: Both languages visible with flag + code
    // SSR and client render identical HTML - only onClick behavior changes
    return (
        <div className="language-selector flex gap-0.5 p-1 rounded-lg bg-muted">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-all ${
                        currentLocale === lang.code
                            ? 'bg-primary/20 ring-2 ring-primary/50'
                            : 'opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`Switch to ${lang.name}`}
                >
                    <span className="text-xs">{lang.flag}</span>
                    <span className="uppercase">{lang.label}</span>
                </button>
            ))}
        </div>
    );
}
