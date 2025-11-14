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

// Function to adapt timeline data for components
function getTimelineItems(lang: 'en' | 'es'): TimelineItemForComponent[] {
    return timelineData.map((item, index) => ({
        id: index + 1,
        year: item.year,
        title: item.title[lang],
        subtitle: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        content: item.description[lang],
        // Keep Tailwind classes for mobile timeline
        color: hexToTailwindGradient(item.color),
        // Keep the original hex color for desktop timeline
        colorHex: item.color,
        icon: item.icon
    }));
}

// Helper function to convert hex to Tailwind gradient
function hexToTailwindGradient(hexColor: string): string {
    // Map common hex colors to Tailwind colors
    const colorMap: { [key: string]: string } = {
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
        '#6366f1': 'from-indigo-500 to-indigo-600'
    };

    return colorMap[hexColor] || 'from-blue-500 to-purple-500';
}

interface TimelineProps {
    lang: 'en' | 'es';
}

export default function Timeline({ lang }: TimelineProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);

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

    // Get timeline items based on language
    const timelineItems = getTimelineItems(lang);

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
