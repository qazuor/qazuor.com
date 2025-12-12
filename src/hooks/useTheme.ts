import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for theme detection and management
 * Uses MutationObserver to track changes to the dark class on document.documentElement
 *
 * @returns Object with isDark boolean and toggleTheme function
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isDark, toggleTheme } = useTheme();
 *   return (
 *     <div style={{ background: isDark ? '#000' : '#fff' }}>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        // Initial check
        checkDarkMode();

        // Listen for theme changes via MutationObserver on html class
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    checkDarkMode();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
        setIsDark(!isDark);
    }, [isDark]);

    return { isDark, toggleTheme };
}
