import type { SearchableItem } from './search';

// Extend global interfaces for auto-animate and other custom window properties
declare global {
    interface Window {
        // Auto-animate
        __autoAnimateQueue?: Array<{ el: HTMLElement; options: Record<string, unknown> }>;
        initAutoAnimate?: () => void;
        __initAutoAnimate?: () => void;

        // Search index
        __SEARCH_INDEX__?: SearchableItem[];

        // Tools filter (goodies/tools page)
        __toolsFilterInitialized?: boolean;
        __allToolsCache?: Array<{
            element: Node;
            category: string;
            gridIndex: number;
        }>;
        __initToolCards?: () => void;

        // Projects filter
        __projectsFilterInitialized?: boolean;
        __allProjectCards?: Array<{
            element: HTMLElement;
            tags: string[];
        }>;

        // Testimonials
        __testimonialsInitialized?: boolean;
        __testimonials?: unknown[];

        // View transitions
        __PAGE_TITLES__?: Record<string, string>;

        // Mermaid diagrams
        __mermaidInstance?: unknown;

        // Layout initializations
        __calloutEnhancerInitialized?: boolean;
        __pixelCanvasGlobalInit?: boolean;
    }
}

// Extend HTMLAttributes to include auto-animate attributes
declare module 'astro/types' {
    interface HTMLAttributes {
        autoAnimate?: boolean | string;
        'autoAnimate:duration'?: string;
        'autoAnimate:delay'?: string;
        'autoAnimate:easing'?: string;
        'autoAnimate:disabled'?: string;
    }
}
