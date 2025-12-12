/**
 * Smooth scroll utility for anchor links with custom easing
 * Handles both same-page and cross-page navigation
 * Uses event delegation for View Transitions compatibility
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

// Event delegation for smooth scroll - persists across View Transitions
function setupSmoothScrollDelegation() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

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

                // Update URL hash (without triggering scroll) - preserve pathname and query params
                if (window.history?.pushState) {
                    const newUrl = `${window.location.pathname}${window.location.search}#${targetId}`;
                    window.history.pushState(null, '', newUrl);
                } else {
                    window.location.hash = targetId;
                }

                // Use custom smooth scroll with easing
                smoothScrollTo(offsetPosition, 1200);
            }
        }
    });
}

export function initializeSmoothScroll() {
    // Setup event delegation once - no need for DOMContentLoaded or astro:page-load
    // because event delegation on document persists across View Transitions
    setupSmoothScrollDelegation();
}

// Initialize on script load
if (typeof document !== 'undefined') {
    initializeSmoothScroll();
}
