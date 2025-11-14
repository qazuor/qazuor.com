import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Adapter type for component compatibility
interface TimelineItem {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  content: string;
  color: string;
}

interface TimelineMobileProps {
  lang: 'en' | 'es';
  timelineItems: TimelineItem[];
}

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TimelineMobile({ lang, timelineItems }: TimelineMobileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !timelineRef.current) return;

    const container = containerRef.current;
    const timeline = timelineRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];

    // Clear previous ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === container) {
        trigger.kill();
      }
    });

    // Calculate the total width needed for horizontal scroll
    const itemWidth = window.innerWidth * 0.8; // 80% of screen width per item
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
        minHeight: '100vh',
      });
    });

    // Create horizontal scroll animation
    const horizontalTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`, // Scroll distance
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update progress indicator
          const progressBar = container.querySelector('.progress-bar');
          if (progressBar) {
            gsap.set(progressBar, {
              scaleX: self.progress,
            });
          }

          // Update active dots
          const dots = container.querySelectorAll('.timeline-dot');
          const activeIndex = Math.min(Math.floor(self.progress * items.length), items.length - 1);
          dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
            if (index === activeIndex) {
              gsap.to(dot, { scale: 1.5, backgroundColor: '#3b82f6', duration: 0.3 });
            } else {
              gsap.to(dot, { scale: 1, backgroundColor: '#6b7280', duration: 0.3 });
            }
          });
        },
      },
    });

    // Animate the horizontal movement
    horizontalTl.to(timeline, {
      x: () => -(totalWidth - window.innerWidth),
      ease: 'none',
    });

    // Cleanup function
    return () => {
      horizontalTl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Refresh ScrollTrigger on window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      {/* Mobile Timeline - Horizontal scroll effect */}
      <div
        ref={containerRef}
        className="relative h-screen flex items-center justify-start overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

        {/* Progress bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
          <div className="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left scale-x-0"></div>
        </div>

        {/* Timeline content - Horizontal container */}
        <div ref={timelineRef} className="flex items-center h-full">
          {timelineItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="flex-shrink-0 flex items-center justify-center relative"
              style={{ willChange: 'transform' }}
            >
              <div className="text-center max-w-xs px-6">
                {/* Year badge */}
                <div
                  className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-lg mb-4 shadow-2xl`}
                >
                  {item.year}
                </div>

                {/* Main content */}
                <h3 className="text-2xl font-bold mb-3 leading-tight">{item.title}</h3>

                <p className="text-base text-gray-300 mb-3 font-medium">{item.subtitle}</p>

                <p className="text-sm text-gray-400 leading-relaxed">{item.content}</p>
              </div>

              {/* Visual connector line (except for last item) */}
              {index < timelineItems.length - 1 && (
                <div className="absolute top-1/2 -right-6 w-12 h-px bg-gradient-to-r from-gray-600 to-transparent transform -translate-y-1/2 z-10"></div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline dots indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {timelineItems.map((item, index) => (
            <div
              key={`timeline-dot-${item.id}-${index}`}
              className="timeline-dot w-3 h-3 rounded-full transition-all duration-300 bg-gray-600"
            />
          ))}
        </div>

        {/* Navigation hint */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-center text-sm text-gray-500 z-20">
          <p>{lang === 'es' ? 'Scroll para navegar' : 'Scroll to navigate'}</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
