import { useEffect, useState } from 'react';
import arrowUpIcon from '../../icons/ui/arrow-up.svg?raw';

interface ScrollToTopProps {
  ariaLabel?: string;
}

export function ScrollToTop({ ariaLabel = 'Scroll to top' }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-glow-primary hover:bg-primary-600 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label={ariaLabel}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
          <span dangerouslySetInnerHTML={{ __html: arrowUpIcon }} />
        </button>
      )}
    </>
  );
}
