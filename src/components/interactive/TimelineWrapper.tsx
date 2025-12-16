import { timelineData } from '@/data/timeline';
import { useTheme } from '@/hooks';
import TimelineContent from './TimelineContent';

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
    iconUseItemColor: boolean;
    isSpecial?: boolean;
    specialType?: 'beginning' | 'end';
}

// Function to adapt timeline data for components
function getTimelineItems(lang: 'en' | 'es', isDark: boolean): TimelineItemForComponent[] {
    return timelineData.map((item, index) => {
        const currentColor = isDark ? item.colorDarkTheme : item.colorLightTheme;
        return {
            id: index + 1,
            year: item.year,
            title: item.title[lang],
            subtitle: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            content: item.description[lang],
            color: hexToTailwindGradient(currentColor),
            colorHex: currentColor,
            icon: item.icon,
            iconUseItemColor: item.iconUseItemColor,
            isSpecial: false
        };
    });
}

// Helper function to convert hex to Tailwind gradient
// Uses CSS variables from global.css for easy theme customization
// Reduced to 5 core colors: blue, emerald, amber, violet, cyan
function hexToTailwindGradient(hexColor: string): string {
    const colorMap: { [key: string]: string } = {
        // Light theme colors (darker shades) - keys match timeline.ts colorLightTheme
        '#2563eb': 'from-[var(--color-timeline-blue-from)] to-[var(--color-timeline-blue-to)]',
        '#059669': 'from-[var(--color-timeline-emerald-from)] to-[var(--color-timeline-emerald-to)]',
        '#d97706': 'from-[var(--color-timeline-amber-from)] to-[var(--color-timeline-amber-to)]',
        '#7c3aed': 'from-[var(--color-timeline-violet-from)] to-[var(--color-timeline-violet-to)]',
        '#0891b2': 'from-[var(--color-timeline-cyan-from)] to-[var(--color-timeline-cyan-to)]',
        // Dark theme colors (lighter shades) - keys match timeline.ts colorDarkTheme
        '#60a5fa': 'from-[var(--color-timeline-blue-from)] to-[var(--color-timeline-blue-to)]',
        '#34d399': 'from-[var(--color-timeline-emerald-from)] to-[var(--color-timeline-emerald-to)]',
        '#fbbf24': 'from-[var(--color-timeline-amber-from)] to-[var(--color-timeline-amber-to)]',
        '#a78bfa': 'from-[var(--color-timeline-violet-from)] to-[var(--color-timeline-violet-to)]',
        '#22d3ee': 'from-[var(--color-timeline-cyan-from)] to-[var(--color-timeline-cyan-to)]'
    };

    return colorMap[hexColor] || 'from-[var(--color-timeline-blue-from)] to-[var(--color-timeline-blue-to)]';
}

interface TimelineWrapperProps {
    lang: 'en' | 'es';
    translations?: {
        timeline: {
            beginning: {
                title: string;
                description: string;
            };
            present: {
                description: string;
            };
        };
        workTogether: string;
    };
}

export default function TimelineWrapper({ lang }: TimelineWrapperProps) {
    const { isDark } = useTheme();

    // Get timeline items based on language and theme
    const timelineItems = getTimelineItems(lang, isDark);

    return (
        <div>
            <TimelineContent lang={lang} timelineItems={timelineItems} />
        </div>
    );
}
