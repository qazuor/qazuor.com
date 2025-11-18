import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy load the heavy CommandPalette component
const CommandPaletteInner = lazy(() =>
    import('./CommandPaletteInner').then((module) => ({ default: module.CommandPaletteInner }))
);

interface CommandPaletteProps {
    lang: string;
    ariaLabel?: string;
    placeholder?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * Lightweight wrapper for CommandPalette with code-splitting
 *
 * This component handles:
 * - Global keyboard shortcuts (Cmd/Ctrl+K)
 * - Custom event listening (from CommandButton)
 * - Lazy loading of the heavy CommandPaletteInner component
 *
 * The actual implementation is split into CommandPaletteInner.tsx
 * to reduce initial bundle size (~1.2MB saved in initial load)
 */
export function CommandPalette({
    lang,
    placeholder = 'Type a command or search...',
    isOpen: externalOpen,
    onOpenChange
}: CommandPaletteProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Use external open state if provided, otherwise use internal state
    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    // Listen for custom event from CommandButton
    useEffect(() => {
        const handleOpenCommandPalette = () => {
            setOpen(true);
        };

        window.addEventListener('openCommandPalette', handleOpenCommandPalette);
        return () => {
            window.removeEventListener('openCommandPalette', handleOpenCommandPalette);
        };
    }, [setOpen]);

    // Global keyboard shortcut (Ctrl+K / Cmd+K) to toggle
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, setOpen]);

    // Only render the heavy component when it should be open
    // This ensures the bundle is only loaded when needed
    if (!open) {
        return null;
    }

    return (
        <Suspense
            fallback={
                // Minimal loading fallback - component loads fast enough
                // that this rarely shows, but prevents layout shift
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-lg" aria-hidden="true" />
                </div>
            }
        >
            <CommandPaletteInner lang={lang} placeholder={placeholder} isOpen={open} onOpenChange={setOpen} />
        </Suspense>
    );
}
