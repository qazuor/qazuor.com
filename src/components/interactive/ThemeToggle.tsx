import { useEffect, useState } from 'react';
import moonIcon from '@/icons/ui/moon.svg?raw';
import sunIcon from '@/icons/ui/sun.svg?raw';

interface ThemeToggleProps {
    ariaLabel?: string;
}

/**
 * Theme toggle component
 * Persists theme preference to localStorage and applies to document
 *
 * Optimized for hydration: SSR and client render identical HTML,
 * allowing use of client:idle without hydration mismatch errors.
 * Icons visibility is controlled via CSS (dark: class) to avoid JS-dependent rendering.
 *
 * @param ariaLabel - Accessible label for the button
 */
export function ThemeToggle({ ariaLabel = 'Toggle theme' }: ThemeToggleProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        if (!mounted) return; // Guard for SSR safety

        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';

        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // SSR and client render identical HTML - icons visibility controlled by CSS
    // Moon icon shown in light mode (to switch to dark)
    // Sun icon shown in dark mode (to switch to light)
    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            aria-label={ariaLabel}
        >
            {/* Moon icon - visible in light mode, hidden in dark mode */}
            <span className="block dark:hidden">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: moonIcon }} />
            </span>
            {/* Sun icon - hidden in light mode, visible in dark mode */}
            <span className="hidden dark:block">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: sunIcon }} />
            </span>
        </button>
    );
}
