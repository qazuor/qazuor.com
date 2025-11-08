/**
 * Smooth scroll utility for anchor links with custom easing
 * Handles both same-page and cross-page navigation
 */

// Custom easing function for ease-in-out
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Custom smooth scroll with easing
function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

export function initializeSmoothScroll() {
  document.addEventListener('DOMContentLoaded', () => {
    // Handle all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href?.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Calculate offset for fixed header
            const header = document.querySelector('nav');
            const headerHeight = header ? header.offsetHeight : 80;

            // Calculate target position with offset
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            // Use custom smooth scroll with easing
            smoothScrollTo(offsetPosition, 1200);
          }
        }
      });
    });
  });
}

// Initialize on script load
if (typeof document !== 'undefined') {
  initializeSmoothScroll();
}
