import TypeIt from 'typeit';

// Initialize TypeIt animation
export function initTypeIt(roles) {
    const typeItElement = document.getElementById('typeit');

    if (typeItElement && roles && roles.length > 0) {
        new TypeIt(typeItElement, {
            strings: roles,
            speed: 50,
            breakLines: false,
            loop: true,
            waitUntilVisible: true,
            deleteSpeed: 30,
            nextStringDelay: 2000
        }).go();
    }
}

// Auto-initialize if roles are available in window
if (typeof window !== 'undefined' && window.heroRoles) {
    function autoInit() {
        initTypeIt(window.heroRoles);
    }

    // Initialize on initial page load
    document.addEventListener('DOMContentLoaded', autoInit);

    // Re-initialize after View Transitions navigation
    // Uses custom event dispatched by ViewTransitionGSAP after DOM swap
    document.addEventListener('qazuor:content-ready', autoInit);
}
