// Extend global interfaces for auto-animate
declare global {
    interface Window {
        __autoAnimateQueue?: Array<{ el: HTMLElement; options: Record<string, unknown> }>;
        initAutoAnimate?: () => void;
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

export {};
