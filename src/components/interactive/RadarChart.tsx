import type React from 'react';
import { useEffect, useRef, useState } from 'react';

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
    const radius = (size / 2) * 0.6; // 60% of half size for more padding

    // Calculate polygon points for each skill
    const calculatePoint = (index: number, value: number): { x: number; y: number } => {
        const angle = (Math.PI * 2 * index) / numSkills - Math.PI / 2; // Start from top
        const distance = (value / maxValue) * radius;
        return {
            x: center + distance * Math.cos(angle),
            y: center + distance * Math.sin(angle)
        };
    };

    // Calculate icon position (at outer edge of radar, same distance for all)
    const calculateIconPoint = (index: number): { x: number; y: number } => {
        const angle = (Math.PI * 2 * index) / numSkills - Math.PI / 2;
        const distance = radius * 1.05; // Fixed distance at outer edge
        return {
            x: center + distance * Math.cos(angle),
            y: center + distance * Math.sin(angle)
        };
    };

    // Generate grid levels (concentric polygons)
    const gridPolygons = Array.from({ length: gridLevels }, (_, i) => {
        const levelValue = ((i + 1) / gridLevels) * maxValue;
        const points = Array.from({ length: numSkills }, (_, j) => {
            return calculatePoint(j, levelValue);
        });
        return points.map((p) => `${p.x},${p.y}`).join(' ');
    });

    // Generate skill data polygon
    const skillPoints = skills.map((skill, i) => calculatePoint(i, skill.value));
    const skillPolygon = skillPoints.map((p) => `${p.x},${p.y}`).join(' ');

    // Handle click on skill point
    const handlePointClick = (index: number): void => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <div ref={containerRef} className={`radar-chart-container ${className}`}>
            {titleHtml ? (
                <h3
                    className="text-2xl font-semibold text-center mb-6 text-foreground"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Title HTML is sanitized from translation files
                    dangerouslySetInnerHTML={{ __html: title }}
                />
            ) : (
                <h3 className="text-2xl font-semibold text-center mb-6 text-foreground">{title}</h3>
            )}

            <div className="relative w-full" style={{ aspectRatio: '1/1', maxWidth: `${size}px`, margin: '0 auto' }}>
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full"
                    role="img"
                    aria-label={`${title} radar chart`}
                >
                    {/* Circular shadow behind radar - very prominent */}
                    <defs>
                        <radialGradient id="radarShadow">
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.45" className="text-primary" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
                        </radialGradient>
                        {/* Create a gradient for each axis line */}
                        {skills.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / numSkills - Math.PI / 2;
                            const extendedDistance = radius * 1.25;
                            const extendedPoint = {
                                x: center + extendedDistance * Math.cos(angle),
                                y: center + extendedDistance * Math.sin(angle)
                            };
                            return (
                                <linearGradient
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Gradient keys match axis order
                                    key={i}
                                    id={`axisGradient-${i}`}
                                    x1={center}
                                    y1={center}
                                    x2={extendedPoint.x}
                                    y2={extendedPoint.y}
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                                    <stop offset="70%" stopColor="currentColor" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                </linearGradient>
                            );
                        })}
                    </defs>

                    {/* Shadow circle */}
                    <circle cx={center} cy={center} r={radius * 1.4} fill="url(#radarShadow)" />

                    {/* Grid levels (concentric polygons) - subtle but visible */}
                    <g className="grid-levels">
                        {gridPolygons.map((points, i) => (
                            <polygon
                                // biome-ignore lint/suspicious/noArrayIndexKey: Grid polygon keys are stable
                                key={i}
                                points={points}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-foreground/30"
                                opacity={0.15 + (i / gridLevels) * 0.15}
                            />
                        ))}
                    </g>

                    {/* Axis lines - with fade gradient at the end */}
                    <g className="axis-lines">
                        {skills.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / numSkills - Math.PI / 2;
                            const extendedDistance = radius * 1.25; // Extend beyond outer circle
                            const extendedPoint = {
                                x: center + extendedDistance * Math.cos(angle),
                                y: center + extendedDistance * Math.sin(angle)
                            };
                            return (
                                <line
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Axis line keys match skill order
                                    key={i}
                                    x1={center}
                                    y1={center}
                                    x2={extendedPoint.x}
                                    y2={extendedPoint.y}
                                    stroke={`url(#axisGradient-${i})`}
                                    strokeWidth="2"
                                    className="text-foreground"
                                />
                            );
                        })}
                    </g>

                    {/* Skill data polygon (filled area) - with gradient/shadow effect */}
                    <g className={`skill-polygon ${isVisible ? 'animate-in' : ''}`}>
                        {/* Define gradient for depth effect */}
                        <defs>
                            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" className="text-primary" />
                                <stop
                                    offset="100%"
                                    stopColor="currentColor"
                                    stopOpacity="0.3"
                                    className="text-primary"
                                />
                            </radialGradient>
                        </defs>
                        <polygon
                            points={skillPolygon}
                            fill="url(#radarGradient)"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            style={{
                                transition: 'all 0.3s ease-in-out',
                                animation: isVisible ? 'radar-draw 1s ease-out forwards' : 'none'
                            }}
                        />
                    </g>

                    {/* Skill points (icons at outer edge) */}
                    <g className="skill-points">
                        {skills.map((skill, i) => {
                            const point = calculateIconPoint(i);
                            const isHovered = hoveredIndex === i;
                            const isSelected = selectedIndex === i;
                            const isHighlighted = isHovered || isSelected;

                            return (
                                // biome-ignore lint/a11y/useSemanticElements: SVG doesn't support semantic button element
                                <g
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Skills array order is stable
                                    key={i}
                                    role="button"
                                    tabIndex={0}
                                    className={`skill-point ${isVisible ? 'animate-in' : ''}`}
                                    style={{
                                        animationDelay: `${i * 0.05}s`,
                                        cursor: 'pointer'
                                    }}
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
                                            r={18}
                                            fill={skill.color}
                                            opacity={0.25}
                                            className="transition-all duration-200"
                                        />
                                    )}

                                    {/* Icon as point - medium size */}
                                    {skill.icon ? (
                                        <foreignObject
                                            x={point.x - (isHighlighted ? 16 : 14)}
                                            y={point.y - (isHighlighted ? 16 : 14)}
                                            width={isHighlighted ? 32 : 28}
                                            height={isHighlighted ? 32 : 28}
                                            className="transition-all duration-200"
                                            style={{
                                                filter: isHighlighted
                                                    ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                                                    : 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))'
                                            }}
                                        >
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{
                                                    color: skill.color,
                                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                                    borderRadius: '50%',
                                                    padding: '4px'
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
                                            className="transition-all duration-200"
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
                            const angle = (Math.PI * 2 * i) / numSkills - Math.PI / 2;
                            const angleDeg = ((angle + Math.PI / 2) * 180) / Math.PI;

                            // Intelligent label positioning based on angle
                            // Adjust distance based on quadrant to avoid icon overlap
                            const labelDistance = radius + 55;
                            const extraOffset = { x: 0, y: 0 };

                            // Top (270-90 deg) - push up more
                            if (angleDeg >= 315 || angleDeg < 45) {
                                extraOffset.y = -10;
                            }
                            // Right (45-135 deg) - push right more
                            else if (angleDeg >= 45 && angleDeg < 135) {
                                extraOffset.x = 10;
                            }
                            // Bottom (135-225 deg) - push down more
                            else if (angleDeg >= 135 && angleDeg < 225) {
                                extraOffset.y = 10;
                            }
                            // Left (225-315 deg) - push left more
                            else {
                                extraOffset.x = -10;
                            }

                            const labelX = center + labelDistance * Math.cos(angle) + extraOffset.x;
                            const labelY = center + labelDistance * Math.sin(angle) + extraOffset.y;

                            const isHighlighted = hoveredIndex === i || selectedIndex === i;

                            // Split name by spaces for multi-line text (centered)
                            const words = skill.name.split(' ');
                            const lineHeight = isHighlighted ? (isMobile ? 22 : 16) : isMobile ? 20 : 14;
                            const startY = labelY - ((words.length - 1) * lineHeight) / 2 - 6;

                            return (
                                // biome-ignore lint/a11y/noStaticElementInteractions: SVG g element used for mouse events on labels
                                <g
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Label group keys match skill order
                                    key={i}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{ cursor: skill.description ? 'pointer' : 'default' }}
                                >
                                    {/* Skill name (multi-line if has spaces, centered) */}
                                    {words.map((word, wordIndex) => (
                                        <text
                                            // biome-ignore lint/suspicious/noArrayIndexKey: Word keys are stable
                                            key={wordIndex}
                                            x={labelX}
                                            y={startY + wordIndex * lineHeight}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className={`transition-all duration-200 ${
                                                isHighlighted
                                                    ? 'font-bold text-foreground fill-current'
                                                    : 'font-medium text-foreground-secondary fill-current'
                                            }`}
                                            style={{
                                                fontSize: isHighlighted
                                                    ? isMobile
                                                        ? '20px'
                                                        : '15px'
                                                    : isMobile
                                                      ? '18px'
                                                      : '13px',
                                                letterSpacing: '0.3px'
                                            }}
                                        >
                                            {word}
                                        </text>
                                    ))}

                                    {/* Percentage value with background badge - improved contrast */}
                                    <g>
                                        {/* Background badge - more opaque */}
                                        <rect
                                            x={labelX - (isMobile ? 24 : 18)}
                                            y={labelY + ((words.length - 1) * lineHeight) / 2 + (isMobile ? 8 : 2)}
                                            width={isMobile ? 48 : 36}
                                            height={isMobile ? 22 : 16}
                                            rx={isMobile ? 11 : 8}
                                            fill={skill.color}
                                            opacity={isHighlighted ? 0.9 : 0.85}
                                            className="transition-all duration-200"
                                        />
                                        {/* Percentage text - white with shadow for better contrast */}
                                        <text
                                            x={labelX}
                                            y={labelY + ((words.length - 1) * lineHeight) / 2 + (isMobile ? 19 : 10)}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className={`transition-all duration-200 ${
                                                isHighlighted ? 'font-bold' : 'font-semibold'
                                            }`}
                                            style={{
                                                fontSize: isHighlighted
                                                    ? isMobile
                                                        ? '18px'
                                                        : '13px'
                                                    : isMobile
                                                      ? '16px'
                                                      : '12px',
                                                fill: '#ffffff',
                                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                            }}
                                        >
                                            {skill.value}%
                                        </text>
                                    </g>
                                </g>
                            );
                        })}
                    </g>

                    {/* Tooltips rendered last to appear on top */}
                    <g className="tooltips-layer">
                        {skills.map((skill, i) => {
                            const isHovered = hoveredIndex === i;

                            if (!isHovered || !skill.description) {
                                return null;
                            }

                            // Calculate label position (same as in axis-labels)
                            const angle = (Math.PI * 2 * i) / numSkills - Math.PI / 2;
                            const angleDeg = ((angle + Math.PI / 2) * 180) / Math.PI;
                            const labelDistance = radius + 55;
                            const extraOffset = { x: 0, y: 0 };

                            if (angleDeg >= 315 || angleDeg < 45) {
                                extraOffset.y = -10;
                            } else if (angleDeg >= 45 && angleDeg < 135) {
                                extraOffset.x = 10;
                            } else if (angleDeg >= 135 && angleDeg < 225) {
                                extraOffset.y = 10;
                            } else {
                                extraOffset.x = -10;
                            }

                            const labelX = center + labelDistance * Math.cos(angle) + extraOffset.x;
                            const labelY = center + labelDistance * Math.sin(angle) + extraOffset.y;

                            // Smart tooltip positioning based on label location
                            const tooltipWidth = 220;
                            let tooltipX = labelX - tooltipWidth / 2; // Default: centered
                            const tooltipY = labelY + 25; // Below label

                            // Adjust horizontal position if tooltip would overflow
                            const padding = 10;
                            if (labelX < center - 50) {
                                // Label on left side - align tooltip to the left
                                tooltipX = labelX - 40;
                            } else if (labelX > center + 50) {
                                // Label on right side - align tooltip to the right
                                tooltipX = labelX - tooltipWidth + 40;
                            }

                            // Ensure tooltip stays within bounds
                            if (tooltipX < padding) {
                                tooltipX = padding;
                            } else if (tooltipX + tooltipWidth > size - padding) {
                                tooltipX = size - tooltipWidth - padding;
                            }

                            return (
                                <g
                                    // biome-ignore lint/suspicious/noArrayIndexKey: Tooltip keys match skill order
                                    key={i}
                                    className="tooltip"
                                >
                                    <foreignObject x={tooltipX} y={tooltipY} width={220} height={130}>
                                        <div
                                            className="flex flex-col px-3 py-2.5 rounded-lg max-h-full overflow-hidden"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                                border: '2px solid rgba(79, 70, 229, 0.6)',
                                                color: '#1f2937',
                                                backdropFilter: 'blur(12px)',
                                                boxShadow:
                                                    '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                                                pointerEvents: 'none',
                                                fontSize: isMobile ? '1rem' : '0.75rem'
                                            }}
                                        >
                                            <div
                                                className="font-bold mb-1.5"
                                                style={{
                                                    color: '#111827',
                                                    fontSize: isMobile ? '1.125rem' : '0.8125rem'
                                                }}
                                            >
                                                {skill.name}
                                            </div>
                                            <div className="leading-relaxed" style={{ color: '#4b5563' }}>
                                                {skill.description}
                                            </div>
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Animation styles */}
            <style>{`
                @keyframes radar-draw {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .skill-point.animate-in {
                    animation: point-pop 0.5s ease-out forwards;
                    opacity: 0;
                }

                @keyframes point-pop {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    70% {
                        transform: scale(1.2);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
