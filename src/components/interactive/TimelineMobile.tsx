import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TimelineIcon } from '../ui';

// Register ScrollTrigger plugin only once
let isRegistered = false;
if (typeof window !== 'undefined' && !isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
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
}

interface TimelineMobileProps {
  lang: 'en' | 'es';
  timelineItems: TimelineItem[];
}

export default function TimelineMobile({ timelineItems }: TimelineMobileProps) {
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
        currentIndex < allTimelineItems.length - 1
          ? allTimelineItems[currentIndex + 1]?.year || ''
          : '',
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
    if (
      !allTimelineItems ||
      allTimelineItems.length === 0 ||
      !containerRef.current ||
      !timelineRef.current
    )
      return;

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
        x: 0,
      });

      // Position items horizontally
      items.forEach((item) => {
        gsap.set(item, {
          width: itemWidth,
          height: '100vh',
        });
      });

      // Create horizontal scroll animation
      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalWidth}`, // Use total width for full scroll distance
          pin: true,
          pinSpacing: true, // Allow proper spacing for pinned element
          scrub: 0.3, // Scrub más bajo para snap más agresivo
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            setIsTimelineActive(true);
            controlScrollToTopButton(true); // Hide button with fade out
          },
          onLeave: () => {
            setIsTimelineActive(false);
            controlScrollToTopButton(false); // Show button with fade in
          },
          onEnterBack: () => {
            setIsTimelineActive(true);
            controlScrollToTopButton(true); // Hide button with fade out
          },
          onLeaveBack: () => {
            setIsTimelineActive(false);
            controlScrollToTopButton(false); // Show button with fade in
          },
          snap: {
            snapTo: (value) => {
              // Create snap points for each item (0, 1/length-1, 2/length-1, etc.)
              const snapPoints = [];
              for (let i = 0; i < items.length; i++) {
                snapPoints.push(i / (items.length - 1));
              }

              // Find closest snap point
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
            duration: { min: 0.1, max: 0.3 }, // Mucho más rápido
            delay: 0.05, // Delay mínimo para snap inmediato
            ease: 'back.out(2)', // Ease más acentuado con "bounce"
          },
          onUpdate: (self) => {
            // Update current index based on progress with more accurate calculation
            const exactProgress = self.progress * (items.length - 1);
            const activeIndex = Math.round(exactProgress);
            const clampedIndex = Math.max(0, Math.min(activeIndex, items.length - 1));
            setCurrentIndex(clampedIndex);
          },
        },
      });

      // Animate the horizontal movement with improved easing
      horizontalTl.to(timeline, {
        x: () => -(totalWidth - window.innerWidth),
        ease: 'none', // Linear for scrub, snap will handle easing
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

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (containerRef.current?.dataset.timeline === 'active') {
          ScrollTrigger.refresh();
        }
      }, 250);
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
          <p>No hay elementos en la timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      {/* Fixed indicators that don't move with horizontal scroll */}

      {/* Fixed Previous year indicator - top left */}
      {currentIndex > 0 && (
        <div className="fixed top-20 left-2 flex flex-col items-center z-20">
          <div
            className="flex items-center gap-2 transition-opacity duration-300 ease-in-out"
            style={{ opacity: prevYearVisible ? 0.15 : 0 }}
          >
            <span className="text-gray-400 text-2xl">←</span>
            <div className="text-lg font-mono font-semibold text-gray-400">{displayedPrevYear}</div>
          </div>
        </div>
      )}

      {/* Fixed large background icon for current item */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <div
          className="transition-opacity duration-300 ease-in-out"
          style={{
            opacity: iconVisible ? 0.03 : 0,
          }}
        >
          <TimelineIcon
            iconName={displayedIcon}
            className={`w-[25rem] h-[25rem] text-gray-400 transform ${currentIndex % 2 ? 'rotate-6' : '-rotate-6'}`}
          />
        </div>
      </div>

      {/* Fixed Next year indicator - bottom right */}
      {currentIndex < allTimelineItems.length - 1 && (
        <div className="fixed bottom-14 right-2 flex flex-col items-center z-20">
          <div
            className="flex items-center gap-2 transition-opacity duration-300 ease-in-out"
            style={{ opacity: nextYearVisible ? 0.15 : 0 }}
          >
            <div className="text-lg font-mono font-semibold text-gray-400">{displayedNextYear}</div>
            <span className="text-gray-400 text-2xl">→</span>
          </div>
        </div>
      )}

      {/* Fixed Progress indicator at bottom */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {allTimelineItems.map((item, dotIndex) => (
          <div
            key={item.id}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              dotIndex === currentIndex ? 'opacity-100 h-3 w-3 -mt-1' : 'opacity-30'
            }`}
            style={{
              backgroundColor:
                dotIndex === currentIndex
                  ? allTimelineItems[currentIndex].colorHex
                  : 'hsl(var(--text-muted))',
            }}
          />
        ))}
      </div>

      {/* Mobile timeline container - horizontal scroll effect */}
      <div className="w-full h-full flex items-center justify-start overflow-hidden">
        {/* Timeline content - Horizontal container */}
        <div
          ref={timelineRef}
          className="flex items-center h-full"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
          }}
        >
          {allTimelineItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="flex-shrink-0 flex items-center justify-center relative"
              style={{ willChange: 'transform' }}
            >
              {/* Main content - centered */}
              <div className="relative z-10 flex flex-col items-center text-center px-8 pr-16 max-w-md">
                <p className="text-base opacity-80" style={{ color: 'hsl(var(--text-secondary))' }}>
                  {item.subtitle}
                </p>
                {/* Year */}
                <div className="text-5xl font-mono font-bold mb-6" style={{ color: item.colorHex }}>
                  {item.year}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 flex items-center justify-center mb-3"
                  style={{ color: item.colorHex }}
                >
                  <TimelineIcon iconName={item.icon} className="w-12 h-12" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-1xl font-bold" style={{ color: item.colorHex }}>
                    {item.title}
                  </h3>

                  <p
                    className="text-lg leading-relaxed opacity-90"
                    style={{ color: 'hsl(var(--text-muted))' }}
                  >
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
