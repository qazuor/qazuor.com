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
    technologies: { label: string; description: string };
    coffees: { label: string; description: string };
    mentored: { label: string; description: string };
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

/**
 * Custom hook for the coffee counter animation
 * Counts from 100,000 to 999,999 then fades to infinity symbol
 */
function useCoffeeAnimation(isVisible: boolean) {
    const [displayValue, setDisplayValue] = useState<string>('100,000');
    const [phase, setPhase] = useState<'counting' | 'fadeOut' | 'fadeIn'>('counting');

    useEffect(() => {
        if (!isVisible) return;

        const startValue = 100000;
        const targetValue = 999999;
        const countDuration = 1200; // Faster animation

        let startTimestamp: number | null = null;
        let animationId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / countDuration, 1);

            // Ease-in-out for smoother acceleration/deceleration
            const easeInOut = progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
            const currentValue = Math.floor(startValue + easeInOut * (targetValue - startValue));

            setDisplayValue(currentValue.toLocaleString());

            if (progress < 1) {
                animationId = window.requestAnimationFrame(step);
            } else {
                // Start fade transition - longer delay for smoother effect
                setPhase('fadeOut');
                setTimeout(() => {
                    setPhase('fadeIn');
                }, 400);
            }
        };

        animationId = window.requestAnimationFrame(step);

        return () => {
            if (animationId) {
                window.cancelAnimationFrame(animationId);
            }
        };
    }, [isVisible]);

    return { displayValue, phase };
}

/**
 * Get color class/style based on stat index for visual variety
 * Pattern: primary -> secondary -> tertiary -> primary
 */
function getStatColor(index: number): { className: string; style?: React.CSSProperties } {
    const colorIndex = index % 3;
    switch (colorIndex) {
        case 0:
            return { className: 'text-primary' };
        case 1:
            return { className: '', style: { color: 'var(--color-secondary-full)' } };
        case 2:
            return { className: '', style: { color: 'var(--color-tertiary-full)' } };
        default:
            return { className: 'text-primary' };
    }
}

/**
 * Special stat item for the coffee counter with infinity animation
 * Counts from 0 to 999,999 then fades to infinity symbol
 */
function CoffeeStatItem({
    stat,
    translation,
    isVisible,
    colorIndex
}: {
    stat: Stat;
    translation: { label: string; description: string };
    isVisible: boolean;
    colorIndex: number;
}) {
    const { displayValue, phase } = useCoffeeAnimation(isVisible);
    const statColor = getStatColor(colorIndex);

    return (
        <li className="stat-item flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:bg-background/50 hover:border-primary/30">
            <div
                className={`stat-value font-bold mb-2 relative h-[1.2em] text-3xl lg:text-4xl ${statColor.className}`}
                style={statColor.style}
            >
                {/* Infinity symbol - shows after fadeIn (larger) */}
                <span
                    className={`absolute inset-0 flex items-center justify-center text-5xl lg:text-8xl transition-all duration-500 ease-in-out ${
                        phase === 'fadeIn' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                >
                    {stat.prefix}
                </span>
                {/* Counter - shows during counting, fades out (smaller font) */}
                <span
                    className={`absolute inset-0 flex items-center justify-center text-xl lg:text-2xl transition-all duration-500 ease-in-out ${
                        phase === 'counting' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                >
                    {displayValue}
                </span>
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

function StatItem({
    stat,
    translation,
    isVisible,
    colorIndex
}: {
    stat: Stat;
    translation: { label: string; description: string };
    isVisible: boolean;
    colorIndex: number;
}) {
    const count = useCountAnimation(stat.value, isVisible);
    const statColor = getStatColor(colorIndex);

    return (
        <li className="stat-item flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:bg-background/50 hover:border-primary/30">
            <div
                className={`stat-value text-3xl lg:text-4xl font-bold mb-2 ${statColor.className}`}
                style={statColor.style}
            >
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
            case 'technologies':
                return translations.technologies;
            case 'coffees':
                return translations.coffees;
            case 'mentored':
                return translations.mentored;
            default:
                return { label: '', description: '' };
        }
    };

    const renderStatItem = (stat: Stat, index: number) => {
        const translation = getTranslation(stat.id);

        // Use special component for coffee counter
        if (stat.id === 'coffees') {
            return (
                <CoffeeStatItem
                    key={stat.id}
                    stat={stat}
                    translation={translation}
                    isVisible={isVisible}
                    colorIndex={index}
                />
            );
        }

        return (
            <StatItem key={stat.id} stat={stat} translation={translation} isVisible={isVisible} colorIndex={index} />
        );
    };

    return (
        <ul
            ref={containerRef}
            className={`stats-counter grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 list-none p-0 m-0 ${className}`}
            aria-label="Key statistics"
        >
            {stats.map(renderStatItem)}
        </ul>
    );
}
