/**
 * Centralized lifecycle manager for Astro View Transitions
 *
 * This module provides a consistent way to handle script initialization
 * that works correctly with View Transitions. It ensures:
 * - Scripts are re-executed after each navigation
 * - Event listeners are not duplicated
 * - Cleanup is performed before page swap
 *
 * Usage:
 * ```ts
 * import { onPageLoad, onPageSwap, registerGlobalListener } from '@/lib/lifecycle';
 *
 * // Register initialization that runs on every page load
 * onPageLoad('my-component', () => {
 *   // Initialize component
 * });
 *
 * // Register cleanup before page swap
 * onPageSwap('my-component', () => {
 *   // Cleanup resources
 * });
 *
 * // Register global event listener (only attached once)
 * registerGlobalListener('scroll', handleScroll, { passive: true });
 * ```
 */

type InitCallback = () => (() => void) | undefined;
type CleanupCallback = () => void;

interface LifecycleManager {
    pageLoadCallbacks: Map<string, InitCallback>;
    pageSwapCallbacks: Map<string, CleanupCallback>;
    globalListeners: Map<string, { cleanup: () => void }>;
    cleanupFunctions: Map<string, () => void>;
    initialized: boolean;
}

// Global state - persists across View Transitions
const manager: LifecycleManager = {
    pageLoadCallbacks: new Map(),
    pageSwapCallbacks: new Map(),
    globalListeners: new Map(),
    cleanupFunctions: new Map(),
    initialized: false
};

/**
 * Register a callback to run on every page load (including View Transitions)
 * @param id Unique identifier for this callback (prevents duplicates)
 * @param callback Function to run on page load. Can return a cleanup function.
 */
export function onPageLoad(id: string, callback: InitCallback): void {
    manager.pageLoadCallbacks.set(id, callback);

    // If already initialized and this is a new registration, run immediately
    if (manager.initialized && document.readyState !== 'loading') {
        runCallback(id, callback);
    }
}

/**
 * Register a callback to run before page swap (cleanup)
 * @param id Unique identifier for this callback
 * @param callback Cleanup function
 */
export function onPageSwap(id: string, callback: CleanupCallback): void {
    manager.pageSwapCallbacks.set(id, callback);
}

/**
 * Register a global event listener that persists across View Transitions
 * Will only be attached once, even if called multiple times
 * @param event Event name
 * @param handler Event handler
 * @param options Event listener options
 * @param target Target element (defaults to window)
 */
export function registerGlobalListener(
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
    target: EventTarget = window
): void {
    const key = `${event}-${handler.toString().slice(0, 50)}`;

    if (manager.globalListeners.has(key)) {
        return; // Already registered
    }

    target.addEventListener(event, handler, options);

    manager.globalListeners.set(key, {
        cleanup: () => target.removeEventListener(event, handler, options)
    });
}

/**
 * Remove a registered callback
 * @param id Callback identifier
 */
export function removeCallback(id: string): void {
    manager.pageLoadCallbacks.delete(id);
    manager.pageSwapCallbacks.delete(id);

    // Run cleanup if exists
    const cleanup = manager.cleanupFunctions.get(id);
    if (cleanup) {
        cleanup();
        manager.cleanupFunctions.delete(id);
    }
}

/**
 * Run a single callback and store its cleanup function
 */
function runCallback(id: string, callback: InitCallback): void {
    try {
        // Run any existing cleanup first
        const existingCleanup = manager.cleanupFunctions.get(id);
        if (existingCleanup) {
            existingCleanup();
            manager.cleanupFunctions.delete(id);
        }

        const cleanup = callback();
        if (typeof cleanup === 'function') {
            manager.cleanupFunctions.set(id, cleanup);
        }
    } catch (error) {
        console.error(`[Lifecycle] Error in callback "${id}":`, error);
    }
}

/**
 * Run all registered page load callbacks
 */
function runPageLoadCallbacks(): void {
    manager.pageLoadCallbacks.forEach((callback, id) => {
        runCallback(id, callback);
    });
}

/**
 * Run all registered page swap callbacks
 */
function runPageSwapCallbacks(): void {
    // Run cleanup functions first
    manager.cleanupFunctions.forEach((cleanup, id) => {
        try {
            cleanup();
        } catch (error) {
            console.error(`[Lifecycle] Error in cleanup "${id}":`, error);
        }
    });
    manager.cleanupFunctions.clear();

    // Then run swap callbacks
    manager.pageSwapCallbacks.forEach((callback, id) => {
        try {
            callback();
        } catch (error) {
            console.error(`[Lifecycle] Error in swap callback "${id}":`, error);
        }
    });
}

/**
 * Initialize the lifecycle manager
 * Should be called once in the base layout
 */
export function initLifecycle(): void {
    if (manager.initialized) {
        return;
    }

    // Handle initial page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runPageLoadCallbacks, { once: true });
    } else {
        // DOM already loaded
        runPageLoadCallbacks();
    }

    // Handle View Transitions navigation
    document.addEventListener('astro:page-load', () => {
        runPageLoadCallbacks();
    });

    // Handle cleanup before page swap
    document.addEventListener('astro:before-swap', () => {
        runPageSwapCallbacks();
    });

    manager.initialized = true;
}

/**
 * Check if the lifecycle manager is initialized
 */
export function isInitialized(): boolean {
    return manager.initialized;
}

/**
 * Get debug info about registered callbacks
 */
export function getDebugInfo(): {
    pageLoadCallbacks: string[];
    pageSwapCallbacks: string[];
    globalListeners: number;
    cleanupFunctions: string[];
} {
    return {
        pageLoadCallbacks: Array.from(manager.pageLoadCallbacks.keys()),
        pageSwapCallbacks: Array.from(manager.pageSwapCallbacks.keys()),
        globalListeners: manager.globalListeners.size,
        cleanupFunctions: Array.from(manager.cleanupFunctions.keys())
    };
}
