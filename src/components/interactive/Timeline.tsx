import { useEffect, useState } from 'react';
import { timelineData } from '../../data/timeline';
import TimelineDesktop from './TimelineDesktop';
import TimelineMobile from './TimelineMobile';

// Adapter type for component compatibility
interface TimelineItemForComponent {
    id: number;
    year: string;
    title: string;
    subtitle: string;
    content: string;
    color: string;
    colorHex: string;
    icon: string;
}

// Hook to detect current theme
function useTheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkTheme();

        // Watch for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
}

// Function to adapt timeline data for components
function getTimelineItems(lang: 'en' | 'es', isDark: boolean): TimelineItemForComponent[] {
    return timelineData
        .filter((item) => {
            // Filter based on device visibility - for now show all since we detect dynamically
            return item.viewInDesktop && item.viewInMobile;
        })
        .map((item, index) => {
            const currentColor = isDark ? item.colorDarkTheme : item.colorLightTheme;
            return {
                id: index + 1,
                year: item.year,
                title: item.title[lang],
                subtitle: item.category.charAt(0).toUpperCase() + item.category.slice(1),
                content: item.description[lang],
                // Keep Tailwind classes for mobile timeline
                color: hexToTailwindGradient(currentColor),
                // Keep the original hex color for desktop timeline
                colorHex: currentColor,
                icon: item.icon
            };
        });
}

// Helper function to convert hex to Tailwind gradient
function hexToTailwindGradient(hexColor: string): string {
    // Map common hex colors to Tailwind colors
    const colorMap: { [key: string]: string } = {
        // Original colors (for dark theme)
        '#f59e0b': 'from-amber-500 to-amber-600',
        '#3b82f6': 'from-blue-500 to-blue-600',
        '#10b981': 'from-emerald-500 to-emerald-600',
        '#8b5cf6': 'from-violet-500 to-violet-600',
        '#06b6d4': 'from-cyan-500 to-cyan-600',
        '#ef4444': 'from-red-500 to-red-600',
        '#f97316': 'from-orange-500 to-orange-600',
        '#eab308': 'from-yellow-500 to-yellow-600',
        '#22c55e': 'from-green-500 to-green-600',
        '#14b8a6': 'from-teal-500 to-teal-600',
        '#a855f7': 'from-purple-500 to-purple-600',
        '#ec4899': 'from-pink-500 to-pink-600',
        '#6366f1': 'from-indigo-500 to-indigo-600',
        // Darker colors (for light theme)
        '#d97706': 'from-amber-600 to-amber-700',
        '#2563eb': 'from-blue-600 to-blue-700',
        '#059669': 'from-emerald-600 to-emerald-700',
        '#7c3aed': 'from-violet-600 to-violet-700',
        '#0891b2': 'from-cyan-600 to-cyan-700',
        '#dc2626': 'from-red-600 to-red-700',
        '#ea580c': 'from-orange-600 to-orange-700',
        '#ca8a04': 'from-yellow-600 to-yellow-700',
        '#16a34a': 'from-green-600 to-green-700',
        '#0d9488': 'from-teal-600 to-teal-700',
        '#9333ea': 'from-purple-600 to-purple-700',
        '#db2777': 'from-pink-600 to-pink-700',
        '#4f46e5': 'from-indigo-600 to-indigo-700',
        // Light variants for dark theme
        '#fbbf24': 'from-amber-400 to-amber-500',
        '#60a5fa': 'from-blue-400 to-blue-500',
        '#34d399': 'from-emerald-400 to-emerald-500',
        '#a78bfa': 'from-violet-400 to-violet-500',
        '#22d3ee': 'from-cyan-400 to-cyan-500',
        '#f87171': 'from-red-400 to-red-500',
        '#2dd4bf': 'from-teal-400 to-teal-500'
    };

    return colorMap[hexColor] || 'from-blue-500 to-purple-500';
}

interface TimelineProps {
    lang: 'en' | 'es';
}

export default function Timeline({ lang }: TimelineProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const isDark = useTheme();

    // Check if device is mobile
    useEffect(() => {
        setIsClient(true);

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Get timeline items based on language and theme
    const timelineItems = getTimelineItems(lang, isDark);

    // Avoid hydration mismatch by not rendering until client-side
    if (!isClient) {
        return <div className="min-h-screen"></div>;
    }

    return (
        <div>
            {isMobile ? (
                <TimelineMobile lang={lang} timelineItems={timelineItems} />
            ) : (
                <TimelineDesktop lang={lang} timelineItems={timelineItems} />
            )}
        </div>
    );
}
