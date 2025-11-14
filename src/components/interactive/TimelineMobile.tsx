import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/timeline-mobile.css';
import { TimelineIcon } from '../ui';

// Register GSAP plugins only once
let isRegistered = false;
if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    isRegistered = true;
}

interface TimelineItem {
    id: number;
    year: string;
    title: string;
    subtitle: string;
    content: string;
    color: string;
    colorHex: string;
    icon: string;
    isSpecial?: boolean; // Para marcar items especiales como el inicio y fin
    specialType?: 'beginning' | 'end'; // Tipo de item especial
}

interface TimelineMobileProps {
    lang: 'en' | 'es';
    timelineItems: TimelineItem[];
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

export default function TimelineMobile({ timelineItems, translations }: TimelineMobileProps) {
    // NO filtrar elementos - usar todos los items incluyendo primero y último
    const allTimelineItems = timelineItems;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [_isTimelineActive, setIsTimelineActive] = useState(false);
    const [iconVisible, setIconVisible] = useState(true);
    const [displayedIcon, setDisplayedIcon] = useState(allTimelineItems[0]?.icon || '');
    const [prevYearVisible, setPrevYearVisible] = useState(true);
    const [nextYearVisible, setNextYearVisible] = useState(true);
    const [displayedPrevYear, setDisplayedPrevYear] = useState('');
    const [displayedNextYear, setDisplayedNextYear] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Function to control scroll to top button visibility
    const controlScrollToTopButton = useCallback((hide: boolean) => {
        const scrollToTopButton = document.querySelector('[data-scroll-to-top]') as HTMLElement;
        if (scrollToTopButton) {
            if (hide) {
                scrollToTopButton.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                scrollToTopButton.style.opacity = '0';
                scrollToTopButton.style.transform = 'scale(0.8)';
                scrollToTopButton.style.pointerEvents = 'none';
            } else {
                scrollToTopButton.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
                scrollToTopButton.style.opacity = '';
                scrollToTopButton.style.transform = '';
                scrollToTopButton.style.pointerEvents = '';
            }
        }
    }, []);

    // Function to navigate to specific timeline item
    const navigateToItem = useCallback(
        (targetIndex: number) => {
            if (
                !containerRef.current ||
                !allTimelineItems ||
                targetIndex < 0 ||
                targetIndex >= allTimelineItems.length
            ) {
                return;
            }

            // Get the ScrollTrigger instance
            const scrollTriggers = ScrollTrigger.getAll();
            const timelineScrollTrigger = scrollTriggers.find((st) => st.trigger === containerRef.current);

            if (timelineScrollTrigger) {
                // Calculate exact progress for the target index
                const targetProgress = allTimelineItems.length === 1 ? 0 : targetIndex / (allTimelineItems.length - 1);

                const scrollStart = timelineScrollTrigger.start;
                const scrollEnd = timelineScrollTrigger.end;
                const totalScrollDistance = scrollEnd - scrollStart;
                const targetScrollY = scrollStart + totalScrollDistance * targetProgress;

                // Use ScrollTo with proper easing
                gsap.to(window, {
                    scrollTo: {
                        y: targetScrollY,
                        autoKill: true
                    },
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => {
                        setCurrentIndex(targetIndex);
                    }
                });
            }
        },
        [allTimelineItems]
    );

    // Handle background icon and years fade transition when currentIndex changes
    useEffect(() => {
        // Only run if we have timeline items
        if (!allTimelineItems || allTimelineItems.length === 0) return;
        const handleTransitions = async () => {
            // Fade out current icon and years
            setIconVisible(false);
            setPrevYearVisible(false);
            setNextYearVisible(false);

            // Wait for fade out to complete
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Update to new values
            setDisplayedIcon(allTimelineItems[currentIndex]?.icon || '');
            setDisplayedPrevYear(currentIndex > 0 ? allTimelineItems[currentIndex - 1]?.year || '' : '');
            setDisplayedNextYear(
                currentIndex < allTimelineItems.length - 1 ? allTimelineItems[currentIndex + 1]?.year || '' : ''
            );

            // Fade in new values
            setIconVisible(true);
            setPrevYearVisible(true);
            setNextYearVisible(true);
        };

        handleTransitions();
    }, [currentIndex, allTimelineItems]);

    // GSAP ScrollTrigger setup
    useEffect(() => {
        // Only run if we have timeline items and refs are available
        if (!allTimelineItems || allTimelineItems.length === 0 || !containerRef.current || !timelineRef.current) return;

        const container = containerRef.current;
        const timeline = timelineRef.current;
        const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];

        // Clear ALL ScrollTriggers for this component to prevent conflicts
        ScrollTrigger.getAll().forEach((trigger) => {
            trigger.kill();
        });

        // Wait for DOM to be ready
        const initScrollTrigger = () => {
            // Calculate the total width needed for horizontal scroll
            const itemWidth = window.innerWidth; // 100vw per item
            const totalWidth = items.length * itemWidth;

            // Set the timeline container width and initial position
            gsap.set(timeline, {
                width: totalWidth,
                x: 0
            });

            // Position items horizontally
            items.forEach((item) => {
                gsap.set(item, {
                    width: itemWidth,
                    height: '100vh'
                });
            });

            // Create horizontal scroll animation with 3D perspective
            const horizontalTl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: () => `+=${totalWidth}`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 1.3,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        setIsTimelineActive(true);
                        controlScrollToTopButton(true);
                    },
                    onLeave: () => {
                        setIsTimelineActive(false);
                        controlScrollToTopButton(false);
                    },
                    onEnterBack: () => {
                        setIsTimelineActive(true);
                        controlScrollToTopButton(true);
                    },
                    onLeaveBack: () => {
                        setIsTimelineActive(false);
                        controlScrollToTopButton(false);
                    },
                    snap: {
                        snapTo: (value) => {
                            // Create exact snap points for each item
                            const snapPoints = [];
                            for (let i = 0; i < items.length; i++) {
                                snapPoints.push(i / (items.length - 1));
                            }

                            // Find the closest snap point
                            let closest = snapPoints[0];
                            let minDistance = Math.abs(value - closest);

                            for (const point of snapPoints) {
                                const distance = Math.abs(value - point);
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    closest = point;
                                }
                            }

                            return closest;
                        },
                        duration: { min: 0.1, max: 0.4 },
                        delay: 1,
                        ease: 'power2.out'
                    },
                    onUpdate: (self) => {
                        // Update current index based on progress
                        const exactProgress = self.progress * (items.length - 1);
                        const activeIndex = Math.round(exactProgress);
                        const clampedIndex = Math.max(0, Math.min(activeIndex, items.length - 1));
                        setCurrentIndex(clampedIndex);

                        // Apply 3D perspective animations to individual cards
                        items.forEach((item, index) => {
                            const card = item.querySelector('.timeline-card');
                            if (card) {
                                const itemProgress = self.progress * (items.length - 1) - index;
                                const absProgress = Math.abs(itemProgress);

                                // Enhanced perspective calculations with smoother falloff
                                const distance = Math.min(absProgress, 2);
                                const isActive = absProgress < 0.3; // Active item has some tolerance

                                // Calculate perspective values with improved curves
                                const rotateY = isActive ? 0 : itemProgress * 15;
                                const scale = isActive ? 1 : Math.max(0.85, 1 - distance * 0.1);
                                const opacity = isActive ? 1 : Math.max(0.4, 1 - distance * 0.3);
                                const translateZ = isActive ? 0 : Math.max(-60, -distance * 30);

                                // Apply 3D transforms with smooth easing
                                gsap.set(card, {
                                    rotationY: rotateY,
                                    scale: scale,
                                    opacity: opacity,
                                    z: translateZ,
                                    transformOrigin: 'center center',
                                    force3D: true
                                });

                                // Add state classes for enhanced styling
                                card.classList.remove('is-active', 'is-near', 'is-far');
                                if (isActive) {
                                    card.classList.add('is-active');
                                } else if (absProgress < 1) {
                                    card.classList.add('is-near');
                                } else {
                                    card.classList.add('is-far');
                                }
                            }
                        });
                    }
                }
            });

            // Animate the horizontal movement - CORRECTED for perfect centering
            horizontalTl.to(timeline, {
                x: () => -((items.length - 1) * window.innerWidth), // Each item moves exactly one viewport width
                ease: 'none'
            });

            return horizontalTl;
        };

        // Initialize after a small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            initScrollTrigger();

            // Store timeline reference for cleanup
            if (containerRef.current) {
                containerRef.current.dataset.timeline = 'active';
            }
        }, 100);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);

            // Kill all ScrollTriggers for this component
            ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill();
            });

            // Restore scroll to top button when component unmounts
            controlScrollToTopButton(false);

            // Clear timeline reference
            if (containerRef.current) {
                delete containerRef.current.dataset.timeline;
            }
        };
    }, [controlScrollToTopButton, allTimelineItems]);

    // Refresh ScrollTrigger on window resize with debounce
    useEffect(() => {
        // Only set up resize listener if we have timeline items
        if (!allTimelineItems || allTimelineItems.length === 0) return;

        let resizeTimeout: number;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (containerRef.current?.dataset.timeline === 'active') {
                    ScrollTrigger.refresh();
                }
            }, 250) as unknown as number;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [allTimelineItems]);

    // Si no hay items, mostrar un placeholder después de todos los hooks
    if (!allTimelineItems || allTimelineItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p style={{ color: 'hsl(var(--text-muted))' }}>No hay elementos en la timeline</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-screen">
            {/* Fixed indicators that don't move with horizontal scroll */}

            {/* Enhanced Previous year indicator - top left */}
            {currentIndex > 0 && (
                <button
                    type="button"
                    className="fixed top-24 left-4 z-20 cursor-pointer"
                    onClick={() => navigateToItem(currentIndex - 1)}
                    aria-label={`Go to previous item: ${allTimelineItems[currentIndex - 1]?.year}`}
                >
                    <div className="timeline-nav-indicator timeline-nav-prev">
                        <div
                            className="flex items-center gap-3 transition-all duration-500 ease-out hover:scale-105 min-w-[120px]"
                            style={{
                                opacity: prevYearVisible ? 0.8 : 0,
                                transform: prevYearVisible ? 'translateX(0)' : 'translateX(-20px)'
                            }}
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center timeline-nav-icon flex-shrink-0"
                                style={{ backgroundColor: `${allTimelineItems[currentIndex - 1].colorHex}20` }}
                            >
                                <span
                                    className="text-lg font-bold"
                                    style={{ color: allTimelineItems[currentIndex - 1].colorHex }}
                                >
                                    ←
                                </span>
                            </div>
                            <div className="flex flex-col flex-1">
                                <span
                                    className="text-xs uppercase tracking-wider opacity-60"
                                    style={{ color: 'hsl(var(--foreground-secondary))' }}
                                >
                                    Previous
                                </span>
                                <div
                                    className="text-lg font-mono font-bold truncate"
                                    style={{ color: allTimelineItems[currentIndex - 1].colorHex }}
                                >
                                    {displayedPrevYear}
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            )}

            {/* Enhanced large background icon with particles effect */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                {/* Animated particles */}
                <div className="absolute inset-0 timeline-particles">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={`particle-${allTimelineItems[currentIndex].id}-${i}`}
                            className="absolute w-2 h-2 rounded-full timeline-particle"
                            style={{
                                backgroundColor: `${allTimelineItems[currentIndex].colorHex}20`,
                                left: `${20 + i * 12}%`,
                                top: `${30 + (i % 3) * 20}%`,
                                animationDelay: `${i * 0.8}s`,
                                opacity: iconVisible ? 0.3 : 0
                            }}
                        />
                    ))}
                </div>

                {/* Main background icon */}
                <div
                    className="relative transition-all duration-700 ease-out timeline-bg-icon"
                    style={{
                        opacity: iconVisible ? 0.02 : 0,
                        transform: `scale(${iconVisible ? 1 : 0.8}) rotate(${currentIndex % 2 ? '6deg' : '-6deg'})`,
                        filter: `blur(${iconVisible ? '2px' : '4px'})`
                    }}
                >
                    {/* Glow effect behind icon */}
                    <div
                        className="absolute inset-0 timeline-bg-glow"
                        style={{
                            background: `radial-gradient(circle, ${allTimelineItems[currentIndex].colorHex}15, transparent 70%)`,
                            filter: 'blur(40px)',
                            transform: 'scale(1.5)'
                        }}
                    />

                    {/* The icon itself */}
                    <div style={{ color: allTimelineItems[currentIndex].colorHex }}>
                        <TimelineIcon iconName={displayedIcon} className="w-[28rem] h-[28rem] timeline-breathing" />
                    </div>
                </div>
            </div>

            {/* Enhanced Next year indicator - top right */}
            {currentIndex < allTimelineItems.length - 1 && (
                <button
                    type="button"
                    className="fixed top-24 right-4 z-20 cursor-pointer"
                    onClick={() => navigateToItem(currentIndex + 1)}
                    aria-label={`Go to next item: ${allTimelineItems[currentIndex + 1]?.year}`}
                >
                    <div className="timeline-nav-indicator timeline-nav-next">
                        <div
                            className="flex items-center gap-3 transition-all duration-500 ease-out hover:scale-105 min-w-[120px]"
                            style={{
                                opacity: nextYearVisible ? 0.8 : 0,
                                transform: nextYearVisible ? 'translateX(0)' : 'translateX(20px)'
                            }}
                        >
                            <div className="flex flex-col text-right flex-1">
                                <span
                                    className="text-xs uppercase tracking-wider opacity-60"
                                    style={{ color: 'hsl(var(--foreground-secondary))' }}
                                >
                                    Next
                                </span>
                                <div
                                    className="text-lg font-mono font-bold truncate"
                                    style={{ color: allTimelineItems[currentIndex + 1].colorHex }}
                                >
                                    {displayedNextYear}
                                </div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center timeline-nav-icon flex-shrink-0"
                                style={{ backgroundColor: `${allTimelineItems[currentIndex + 1].colorHex}20` }}
                            >
                                <span
                                    className="text-lg font-bold"
                                    style={{ color: allTimelineItems[currentIndex + 1].colorHex }}
                                >
                                    →
                                </span>
                            </div>
                        </div>
                    </div>
                </button>
            )}

            {/* Simplified Progress indicator at bottom - just dots and lines */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 px-4 max-w-full">
                <div className="flex items-center justify-center space-x-3 overflow-hidden">
                    {allTimelineItems.map((item, dotIndex) => (
                        <button
                            key={item.id}
                            type="button"
                            className="relative timeline-progress-dot cursor-pointer p-2 -m-2 transition-transform duration-200 hover:scale-110 flex-shrink-0"
                            onClick={() => navigateToItem(dotIndex)}
                            aria-label={`Go to ${item.year} - ${item.title}`}
                        >
                            {/* Background circle */}
                            <div className="w-3 h-3 rounded-full bg-white/20" />

                            {/* Active indicator */}
                            {dotIndex === currentIndex && (
                                <>
                                    {/* Outer glow ring */}
                                    <div
                                        className="absolute inset-0 rounded-full timeline-active-glow"
                                        style={{
                                            background: `radial-gradient(circle, ${item.colorHex}60, transparent 70%)`,
                                            filter: 'blur(8px)',
                                            transform: 'scale(2)'
                                        }}
                                    />
                                    {/* Active dot */}
                                    <div
                                        className="absolute inset-0 rounded-full timeline-active-dot"
                                        style={{ backgroundColor: item.colorHex }}
                                    />
                                </>
                            )}

                            {/* Progress line to next dot */}
                            {dotIndex < allTimelineItems.length - 1 && (
                                <div
                                    className="absolute top-1/2 left-full w-6 h-0.5 transform -translate-y-1/2 timeline-progress-line"
                                    style={{
                                        backgroundColor:
                                            dotIndex < currentIndex ? item.colorHex : 'rgba(255,255,255,0.2)',
                                        transition: 'background-color 0.5s ease-in-out'
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile timeline container - horizontal scroll effect with 3D perspective */}
            <div className="w-full h-full flex items-center justify-start overflow-hidden timeline-3d-container">
                {/* Timeline content - Horizontal container with perspective */}
                <div
                    ref={timelineRef}
                    className="flex items-center h-full timeline-3d-stage"
                    style={{
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        perspective: '1200px',
                        perspectiveOrigin: '50% 50%'
                    }}
                >
                    {allTimelineItems.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => {
                                itemsRef.current[index] = el;
                            }}
                            className="flex-shrink-0 flex items-center justify-center relative h-full timeline-item-3d"
                            style={{
                                willChange: 'transform',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Render condicional para items especiales */}
                            {item.isSpecial ? (
                                /* Items especiales: Beginning y Present - Solo texto sin card */
                                <div className="relative z-10 w-[90%] max-w-lg mx-auto h-auto max-h-[65vh] min-h-[400px] flex items-center justify-center">
                                    {/* Special content - Sin fondo de card */}
                                    <div className="relative text-center flex flex-col justify-center h-full space-y-8 px-8">
                                        {item.specialType === 'beginning' ? (
                                            <>
                                                {/* Beginning Section */}
                                                <h2
                                                    className="text-3xl font-bold leading-tight"
                                                    style={{ color: item.colorHex }}
                                                >
                                                    {translations?.timeline.beginning?.title || 'My Journey Begins'}
                                                </h2>
                                                <div
                                                    className="text-foreground-secondary text-xl leading-relaxed max-w-md mx-auto"
                                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Translations content is trusted
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            translations?.timeline.beginning?.description ||
                                                            'This is where my story starts...'
                                                    }}
                                                />
                                            </>
                                        ) : item.specialType === 'end' ? (
                                            <>
                                                {/* Present/End Section */}
                                                <div className="space-y-8">
                                                    <div
                                                        className="text-foreground-secondary text-xl leading-relaxed max-w-md mx-auto"
                                                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Translations content is trusted
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                translations?.timeline.present?.description ||
                                                                'Today I continue building and innovating...'
                                                        }}
                                                    />
                                                    <div className="flex justify-center">
                                                        <a
                                                            href="#contact"
                                                            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-glow-primary transition-all duration-300 hover:scale-105 text-lg"
                                                            // biome-ignore lint/security/noDangerouslySetInnerHtml: Translations content is trusted
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    translations?.workTogether || "Let's Work Together"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* Fallback para items especiales sin tipo específico */
                                            <div className="text-center">
                                                <h2 className="text-2xl font-bold text-foreground">{item.title}</h2>
                                                <p className="text-foreground-secondary mt-4">{item.content}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Items normales de timeline */
                                <div
                                    className="timeline-card relative z-10 w-full mr-[40px] ml-[5px] mx-auto h-auto max-h-[65vh] min-h-[400px]"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Dynamic gradient overlay */}
                                    <div
                                        className="absolute inset-0 rounded-3xl opacity-10"
                                        style={{
                                            background: `linear-gradient(135deg, ${item.colorHex}20, ${item.colorHex}05)`
                                        }}
                                    />

                                    {/* Card content with flexible spacing */}
                                    <div className="relative p-6 text-center flex flex-col justify-center flex-1 h-full">
                                        {/* Category Badge */}
                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium mb-3 category-badge mx-auto">
                                            <span
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{ backgroundColor: item.colorHex }}
                                            />
                                            {item.subtitle}
                                        </div>

                                        {/* Year in solid color */}
                                        <div className="mb-4">
                                            <div
                                                className="text-5xl font-mono font-bold timeline-year"
                                                style={{ color: item.colorHex }}
                                            >
                                                {item.year}
                                            </div>
                                        </div>

                                        {/* Enhanced Icon with glow */}
                                        <div className="relative mb-4 timeline-icon-container mx-auto">
                                            {/* Glow effect */}
                                            <div
                                                className="absolute inset-0 rounded-full timeline-glow"
                                                style={{
                                                    background: `radial-gradient(circle, ${item.colorHex}40, transparent 70%)`,
                                                    filter: 'blur(20px)'
                                                }}
                                            />
                                            {/* Icon */}
                                            <div
                                                className="relative w-16 h-16 flex items-center justify-center timeline-icon mx-auto"
                                                style={{ color: item.colorHex }}
                                            >
                                                <TimelineIcon iconName={item.icon} className="w-12 h-12" />
                                            </div>
                                        </div>

                                        {/* Content with flexible spacing */}
                                        <div className="space-y-3 flex-1 flex flex-col justify-center">
                                            <h3
                                                className="text-xl font-bold timeline-title tracking-tight"
                                                style={{ color: item.colorHex }}
                                            >
                                                {item.title}
                                            </h3>

                                            <p
                                                className="text-sm leading-relaxed timeline-content max-w-xs mx-auto"
                                                style={{ color: 'hsl(var(--foreground-secondary))' }}
                                            >
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div
                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full"
                                        style={{ backgroundColor: item.colorHex }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
