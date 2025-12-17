import type React from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTheme } from '@/hooks';
import {
    type CalculationParams,
    calculateAngle,
    calculateIconPoint,
    generateGridPolygons,
    generateSkillPolygon,
    roundTo
} from '@/utils/radarChart/calculations';

/**
 * Get the appropriate icon color based on whether the SVG uses currentColor
 * Icons that use currentColor (UI icons) get the skill's color
 * Icons with embedded colors (tech brand icons) keep their original colors
 */
function getIconColor(iconSvg: string, skillColor: string, _isDarkMode: boolean): string {
    // Check if the SVG uses currentColor (UI icons do, tech brand icons don't)
    if (iconSvg.includes('currentColor')) {
        // Use the skill's color for UI icons
        return skillColor;
    }
    // For tech icons with embedded colors, the color style won't affect them
    // but we return the skill color anyway for consistency
    return skillColor;
}

/**
 * Get the background color for icon containers
 * Uses CSS variable from global.css that changes with theme
 * Dark mode: slate-700 for contrast with white icons
 * Light mode: slate-200 for contrast with dark icons
 */
function getIconBackground(_isDarkMode: boolean): string {
    return 'var(--color-radar-icon-bg)';
}

import {
    calculateFontSize,
    calculateLabelPosition,
    calculateLineHeight,
    calculateMultiLineStartY,
    calculateTextAnchor
} from '@/utils/radarChart/positioning';

// Static style constants (extracted to avoid object recreation on each render)
const SKILL_POINT_BASE_STYLE: React.CSSProperties = {
    cursor: 'pointer'
};

const TOOLTIP_CONTAINER_BASE_STYLE: React.CSSProperties = {
    borderRadius: '16px',
    pointerEvents: 'none'
};

export interface RadarChartSkill {
    name: string;
    value: number; // 0-100
    color: string;
    icon?: string; // SVG icon as string
    description?: string; // Optional description for tooltip
}

export interface RadarChartProps {
    skills: RadarChartSkill[];
    title: string;
    titleHtml?: boolean; // Whether title contains HTML
    size?: number; // Size in pixels (responsive will override)
    gridLevels?: number; // Number of concentric circles
    maxValue?: number; // Maximum value (default 100)
    className?: string;
}

/**
 * RadarChart Component
 * Custom SVG-based radar chart for skills visualization
 * Features:
 * - Hover tooltips
 * - Entrance animations
 * - Click to highlight
 * - Fully responsive
 * - Dark/light mode support via CSS variables
 */
export function RadarChart({
    skills,
    title,
    titleHtml = false,
    size = 400,
    gridLevels = 5,
    maxValue = 100,
    className = ''
}: RadarChartProps): React.ReactElement {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use shared theme hook for dark mode detection
    const { isDark: isDarkMode } = useTheme();

    // Generate unique ID for this chart instance to avoid gradient ID conflicts
    // useId generates stable IDs between server and client to prevent hydration mismatches
    const reactId = useId();
    const chartId = useMemo(() => `radar${reactId.replace(/:/g, '')}`, [reactId]);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Intersection Observer for entrance animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const numSkills = skills.length;
    const center = size / 2;
    const radius = (size / 2) * 0.55; // 55% of half size for balanced label margin

    // Memoized calculation parameters
    const params: CalculationParams = useMemo(
        () => ({
            center,
            radius,
            numSkills,
            maxValue
        }),
        [center, radius, numSkills, maxValue]
    );

    // Memoized grid polygons (concentric circles)
    const gridPolygons = useMemo(() => generateGridPolygons(gridLevels, params), [gridLevels, params]);

    // Memoized skill data polygon
    const { polygon: skillPolygon } = useMemo(
        () =>
            generateSkillPolygon(
                skills.map((s) => s.value),
                params
            ),
        [skills, params]
    );

    // Pre-calculate icon points for all skills (expensive calculation)
    const skillPoints = useMemo(() => skills.map((_, i) => calculateIconPoint(i, params)), [skills, params]);

    // Pre-calculate axis data (gradients and lines)
    const axisData = useMemo(
        () =>
            skills.map((_, i) => {
                const angle = (Math.PI * 2 * i) / numSkills - Math.PI / 2;
                const extendedDistance = radius * 1.6;
                return {
                    angle,
                    extendedPoint: {
                        x: roundTo(center + extendedDistance * Math.cos(angle)),
                        y: roundTo(center + extendedDistance * Math.sin(angle))
                    }
                };
            }),
        [skills, numSkills, radius, center]
    );

    // Pre-calculate label positions
    const labelPositions = useMemo(
        () =>
            skills.map((skill, i) => {
                const angle = calculateAngle(i, numSkills);
                const { x: labelX, y: labelY } = calculateLabelPosition(angle, radius, center);
                const textAnchor = calculateTextAnchor(angle);
                const words = skill.name.split(' ');
                return { angle, labelX, labelY, textAnchor, words };
            }),
        [skills, numSkills, radius, center]
    );

    // Memoized click handler
    const handlePointClick = useCallback((index: number): void => {
        setSelectedIndex((prev) => (prev === index ? null : index));
    }, []);

    // Memoized tooltip container style (depends on isDarkMode and isMobile)
    const tooltipContainerStyle = useMemo<React.CSSProperties>(
        () => ({
            ...TOOLTIP_CONTAINER_BASE_STYLE,
            background: isDarkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.75)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDarkMode
                ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 4px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            fontSize: isMobile ? '0.875rem' : '0.75rem'
        }),
        [isDarkMode, isMobile]
    );

    // Memoized skill point animation styles (one for each skill)
    const skillPointStyles = useMemo<React.CSSProperties[]>(
        () =>
            skills.map((_, i) => ({
                ...SKILL_POINT_BASE_STYLE,
                animationDelay: `${i * 0.05}s`
            })),
        [skills]
    );

    return (
        <div ref={containerRef} className={`radar-chart-container ${className}`}>
            {titleHtml ? (
                <h3
                    className="text-2xl font-semibold text-center mb-2 text-foreground min-h-[3.5rem]"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Title HTML is sanitized from translation files
                    dangerouslySetInnerHTML={{ __html: title }}
                />
            ) : (
                <h3 className="text-2xl font-semibold text-center mb-2 text-foreground">{title}</h3>
            )}

            <div
                className="relative w-full"
                style={{ aspectRatio: '1/1', maxWidth: `${size}px`, margin: '0 auto', overflow: 'visible' }}
            >
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full"
                    style={{ overflow: 'visible' }}
                    role="img"
                    aria-labelledby={`${chartId}-title`}
                >
                    <title id={`${chartId}-title`}>
                        {`${titleHtml ? title.replace(/<[^>]*>/g, '') : title} radar chart`}
                    </title>
                    {/* Circular shadow behind radar - very prominent */}
                    <defs>
                        <radialGradient id={`${chartId}-shadow`}>
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.45" className="text-primary" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
                        </radialGradient>
                        {/* Create a gradient for each axis line */}
                        {axisData.map((axis, i) => (
                            <linearGradient
                                // biome-ignore lint/suspicious/noArrayIndexKey: Gradient keys match axis order
                                key={i}
                                id={`${chartId}-axis-${i}`}
                                x1={center}
                                y1={center}
                                x2={axis.extendedPoint.x}
                                y2={axis.extendedPoint.y}
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                                <stop offset="70%" stopColor="currentColor" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                            </linearGradient>
                        ))}
                    </defs>

                    {/* Shadow circle */}
                    <circle cx={center} cy={center} r={radius * 1.4} fill={`url(#${chartId}-shadow)`} />

                    {/* Grid levels (concentric polygons) - visible but subtle */}
                    <g className="grid-levels">
                        {gridPolygons.map((points, i) => (
                            <polygon
                                // biome-ignore lint/suspicious/noArrayIndexKey: Grid polygon keys are stable
                                key={i}
                                points={points}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-foreground/40"
                                opacity={0.25 + (i / gridLevels) * 0.2}
                            />
                        ))}
                    </g>

                    {/* Axis lines - with fade gradient at the end */}
                    <g className="axis-lines">
                        {axisData.map((axis, i) => (
                            <line
                                // biome-ignore lint/suspicious/noArrayIndexKey: Axis line keys match skill order
                                key={i}
                                x1={center}
                                y1={center}
                                x2={axis.extendedPoint.x}
                                y2={axis.extendedPoint.y}
                                stroke={`url(#${chartId}-axis-${i})`}
                                strokeWidth="1"
                                className="text-foreground"
                            />
                        ))}
                    </g>

                    {/* Skill data polygon (filled area) - with gradient/shadow effect */}
                    <g className={`skill-polygon ${isVisible ? 'animate-in' : ''}`}>
                        {/* Define gradient for depth effect - more transparent to show grid */}
                        <defs>
                            <radialGradient id={`${chartId}-gradient`} cx="50%" cy="50%" r="50%">
                                <stop
                                    offset="0%"
                                    stopColor="currentColor"
                                    stopOpacity="0.35"
                                    className="text-primary"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="currentColor"
                                    stopOpacity="0.2"
                                    className="text-primary"
                                />
                            </radialGradient>
                        </defs>
                        <polygon
                            points={skillPolygon}
                            fill={`url(#${chartId}-gradient)`}
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            style={{
                                transition: 'all var(--duration-base) var(--ease-in-out)'
                            }}
                        />
                    </g>

                    {/* Skill points (icons at outer edge) */}
                    <g className="skill-points">
                        {skills.map((skill, i) => {
                            const point = skillPoints[i];
                            const isHovered = hoveredIndex === i;
                            const isSelected = selectedIndex === i;
                            const isHighlighted = isHovered || isSelected;

                            return (
                                // biome-ignore lint/a11y/useSemanticElements: SVG elements cannot use <button>, role="button" is the correct approach for interactive SVG groups
                                <g
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Skills array order is stable
                                    key={i}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={skill.name}
                                    className={`skill-point ${isVisible ? 'animate-in' : ''}`}
                                    style={skillPointStyles[i]}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => handlePointClick(i)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handlePointClick(i);
                                        }
                                    }}
                                >
                                    {/* Outer glow circle for hover/selected */}
                                    {isHighlighted && (
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r={30}
                                            fill={skill.color}
                                            opacity={0.25}
                                            className="transition-all duration-fast"
                                        />
                                    )}

                                    {/* Icon as point - larger size for better visibility */}
                                    {skill.icon ? (
                                        <foreignObject
                                            x={point.x - (isHighlighted ? 19 : 17)}
                                            y={point.y - (isHighlighted ? 19 : 17)}
                                            width={isHighlighted ? 38 : 34}
                                            height={isHighlighted ? 38 : 34}
                                            className="transition-all duration-fast"
                                            style={{
                                                filter: isHighlighted
                                                    ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                                                    : 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))'
                                            }}
                                        >
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{
                                                    color: getIconColor(skill.icon, skill.color, isDarkMode),
                                                    backgroundColor: getIconBackground(isDarkMode),
                                                    borderRadius: '50%',
                                                    padding: '7px'
                                                }}
                                                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG icons are from trusted skill data
                                                dangerouslySetInnerHTML={{ __html: skill.icon }}
                                            />
                                        </foreignObject>
                                    ) : (
                                        /* Fallback to circle if no icon */
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r={isHighlighted ? 7 : 6}
                                            fill={skill.color}
                                            stroke="white"
                                            strokeWidth={isHighlighted ? 2.5 : 2}
                                            className="transition-all duration-fast"
                                            style={{
                                                filter: isHighlighted ? 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' : 'none'
                                            }}
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* Axis labels (skill names with percentage) */}
                    <g className="axis-labels">
                        {skills.map((skill, i) => {
                            const { labelX, labelY, textAnchor, words } = labelPositions[i];
                            const isHighlighted = hoveredIndex === i || selectedIndex === i;
                            const lineHeight = calculateLineHeight(isHighlighted, isMobile);
                            const startY = calculateMultiLineStartY(labelY, words.length, lineHeight);

                            return (
                                // biome-ignore lint/a11y/noStaticElementInteractions: SVG g element used for mouse events on labels
                                <g
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Label group keys match skill order
                                    key={i}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{ cursor: skill.description ? 'pointer' : 'default' }}
                                >
                                    {/* Skill name (multi-line if has spaces) */}
                                    {words.map((word, wordIndex) => (
                                        <text
                                            // biome-ignore lint/suspicious/noArrayIndexKey: Word keys are stable
                                            key={wordIndex}
                                            x={labelX}
                                            y={startY + wordIndex * lineHeight}
                                            textAnchor={textAnchor}
                                            dominantBaseline="middle"
                                            className={`transition-all duration-200 ${
                                                isHighlighted
                                                    ? 'font-medium text-foreground fill-current'
                                                    : 'font-medium text-foreground-secondary fill-current'
                                            }`}
                                            style={{
                                                fontSize: `${calculateFontSize(isHighlighted, isMobile, {
                                                    highlightedMobile: 20,
                                                    highlightedDesktop: 13,
                                                    normalMobile: 18,
                                                    normalDesktop: 13
                                                })}px`,
                                                letterSpacing: '0px'
                                            }}
                                        >
                                            {word}
                                        </text>
                                    ))}
                                </g>
                            );
                        })}
                    </g>

                    {/* Center tooltip - shows description of hovered skill */}
                    {hoveredIndex !== null && skills[hoveredIndex]?.description && (
                        <g className="center-tooltip">
                            <foreignObject x={center - 85} y={center - 65} width={170} height={130}>
                                <div
                                    className="flex flex-col items-center justify-center text-center h-full px-3 py-3"
                                    style={tooltipContainerStyle}
                                >
                                    <div
                                        className="font-bold mb-1.5"
                                        style={{
                                            color: skills[hoveredIndex].color,
                                            fontSize: isMobile ? '1.0625rem' : '0.875rem',
                                            textShadow: isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
                                        }}
                                    >
                                        {skills[hoveredIndex].name}
                                    </div>
                                    <div
                                        className="leading-snug"
                                        style={{
                                            color: isDarkMode ? 'rgba(226, 232, 240, 0.9)' : 'rgba(71, 85, 105, 0.95)',
                                            fontSize: isMobile ? '0.8125rem' : '0.6875rem'
                                        }}
                                    >
                                        {skills[hoveredIndex].description}
                                    </div>
                                </div>
                            </foreignObject>
                        </g>
                    )}
                </svg>
            </div>

            {/* Animation styles */}
            <style>{`
                .skill-point.animate-in {
                    animation: point-pulse 0.35s ease-out forwards;
                    transform-box: fill-box;
                    transform-origin: center;
                }

                @keyframes point-pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
