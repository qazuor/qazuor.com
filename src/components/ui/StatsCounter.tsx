/**
 * StatsCounter Component
 *
 * Animated counter component that displays stats with scroll-triggered animation.
 * Used in About section to show key metrics with context.
 *
 * @example
 * <StatsCounter stats={stats} translations={translations} />
 */

import { useEffect, useRef, useState } from 'react';
import type { Stat } from '@/data/stats';

interface StatsTranslations {
    years: { label: string; description: string };
    projects: { label: string; description: string };
    clients: { label: string; description: string };
    lighthouse: { label: string; description: string };
}

interface StatsCounterProps {
    /** Array of stat configurations */
    stats: Stat[];
    /** Translations for labels and descriptions */
    translations: StatsTranslations;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Animate a number from 0 to target value
 */
function useCountAnimation(targetValue: number, isVisible: boolean, duration = 2000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function for smoother animation (ease-out-cubic)
            const easeOutCubic = 1 - (1 - progress) ** 3;
            setCount(Math.floor(easeOutCubic * targetValue));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [targetValue, isVisible, duration]);

    return count;
}

function StatItem({
    stat,
    translation,
    isVisible
}: {
    stat: Stat;
    translation: { label: string; description: string };
    isVisible: boolean;
}) {
    const count = useCountAnimation(stat.value, isVisible);

    return (
        <li className="stat-item flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:bg-background/50 hover:border-primary/30">
            <div className="stat-value text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.prefix}
                {count}
                {stat.suffix}
            </div>
            <div className="stat-label text-sm lg:text-base font-semibold text-foreground mb-1">
                {translation.label}
            </div>
            <div className="stat-description text-xs lg:text-sm text-foreground-secondary leading-relaxed">
                {translation.description}
            </div>
        </li>
    );
}

export function StatsCounter({ stats, translations, className = '' }: StatsCounterProps) {
    const containerRef = useRef<HTMLUListElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            {
                threshold: 0.2, // Trigger when 20% visible
                rootMargin: '0px 0px -50px 0px' // Slight offset from bottom
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const getTranslation = (statId: string): { label: string; description: string } => {
        switch (statId) {
            case 'years':
                return translations.years;
            case 'projects':
                return translations.projects;
            case 'clients':
                return translations.clients;
            case 'lighthouse':
                return translations.lighthouse;
            default:
                return { label: '', description: '' };
        }
    };

    return (
        <ul
            ref={containerRef}
            className={`stats-counter grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 list-none p-0 m-0 ${className}`}
            aria-label="Key statistics"
        >
            {stats.map((stat) => (
                <StatItem key={stat.id} stat={stat} translation={getTranslation(stat.id)} isVisible={isVisible} />
            ))}
        </ul>
    );
}
