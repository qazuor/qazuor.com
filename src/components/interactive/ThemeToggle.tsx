import { useEffect, useState } from 'react';
import moonIcon from '../../icons/ui/moon.svg?raw';
import sunIcon from '../../icons/ui/sun.svg?raw';

interface ThemeToggleProps {
    ariaLabel?: string;
}

/**
 * Theme toggle component
 * Persists theme preference to localStorage and applies to document
 */
export function ThemeToggle({ ariaLabel = 'Toggle theme' }: ThemeToggleProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // Hydration fix - only render after mount
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // Prevent flash of unstyled content
    if (!mounted) {
        return (
            <button type="button" className="p-2 rounded-lg bg-muted" aria-label={ariaLabel}>
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            aria-label={ariaLabel}
        >
            {theme === 'light' ? (
                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file
                <span dangerouslySetInnerHTML={{ __html: moonIcon }} />
            ) : (
                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file
                <span dangerouslySetInnerHTML={{ __html: sunIcon }} />
            )}
        </button>
    );
}
