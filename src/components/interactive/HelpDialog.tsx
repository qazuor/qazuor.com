import { useEffect, useRef } from 'react';
import searchIcon from '@/icons/ui/search.svg?raw';

interface HelpDialogProps {
    isOpen: boolean;
    onBackToCommandPalette: () => void;
}

export function HelpDialog({ isOpen, onBackToCommandPalette }: HelpDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Apply blur effect when help dialog is open
    useEffect(() => {
        const mainContent = document.querySelector('main') as HTMLElement;
        const navigation = document.querySelector('nav') as HTMLElement;
        const footer = document.querySelector('footer') as HTMLElement;

        if (isOpen) {
            // Add blur effect
            if (mainContent) {
                mainContent.style.filter = 'blur(4px) brightness(0.7)';
                mainContent.style.transition = 'filter 0.2s ease-in-out';
            }
            if (navigation) {
                navigation.style.filter = 'blur(4px) brightness(0.7)';
                navigation.style.transition = 'filter 0.2s ease-in-out';
            }
            if (footer) {
                footer.style.filter = 'blur(4px) brightness(0.7)';
                footer.style.transition = 'filter 0.2s ease-in-out';
            }
            document.body.style.overflow = 'hidden';
        } else {
            // Remove blur effect
            if (mainContent) mainContent.style.filter = 'none';
            if (navigation) navigation.style.filter = 'none';
            if (footer) footer.style.filter = 'none';
            document.body.style.overflow = '';
        }

        return () => {
            if (mainContent) mainContent.style.filter = 'none';
            if (navigation) navigation.style.filter = 'none';
            if (footer) footer.style.filter = 'none';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Keyboard handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape' || e.key === 'Backspace') {
                e.preventDefault();
                onBackToCommandPalette(); // Volver al command palette en lugar de solo cerrar
            }

            // Ctrl/Cmd + K to go back to command palette
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onBackToCommandPalette();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onBackToCommandPalette]);

    if (!isOpen) return null;

    const shortcuts = [
        { key: '⌘K / Ctrl+K', description: 'Open/close command palette' },
        { key: 'ESC / Backspace', description: 'Go back to command palette' },
        { key: '↑↓', description: 'Navigate items in command palette' },
        { key: 'Enter', description: 'Select item' },
        { key: '⌘H / Ctrl+H', description: 'Navigate to Home' },
        { key: '⌘P / Ctrl+P', description: 'Navigate to Projects' },
        { key: '⌘B / Ctrl+B', description: 'Navigate to Blog' },
        { key: '⌘T / Ctrl+T', description: 'Navigate to Tools' },
        { key: '⌘A / Ctrl+A', description: 'Navigate to About' },
        { key: '⌘C / Ctrl+C', description: 'Copy current URL' },
        { key: '⌘? / Ctrl+?', description: 'Show this help dialog' },
        { key: '⌘G / Ctrl+G', description: 'Open GitHub profile' },
        { key: '⌘L / Ctrl+L', description: 'Open LinkedIn profile' },
        { key: '⌘F / Ctrl+F', description: 'Open Fiverr profile' },
        { key: '⌘U / Ctrl+U', description: 'Open Upwork profile' }
    ];

    return (
        <div
            className="fixed inset-0 z-[9999]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-dialog-title"
            style={{ zIndex: 999999 }}
        >
            {/* Backdrop */}
            <button
                type="button"
                className="fixed inset-0 bg-black/40 backdrop-blur-lg transition-all duration-300 ease-in-out"
                onClick={onBackToCommandPalette}
                aria-label="Back to command palette"
                tabIndex={-1}
            />

            {/* Help Dialog - Centered */}
            <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 1000000 }}>
                <div ref={dialogRef} className="w-full max-w-2xl command-palette-enter">
                    <div
                        className="rounded-lg border overflow-hidden shadow-2xl bg-background backdrop-blur-sm"
                        style={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center border-b border-foreground/10 px-4">
                            <span
                                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file
                                dangerouslySetInnerHTML={{ __html: searchIcon }}
                                className="text-foreground-muted"
                                aria-hidden="true"
                            />
                            <div className="flex-1 px-4 py-4">
                                <h2 id="help-dialog-title" className="text-lg font-semibold text-foreground">
                                    Keyboard Shortcuts
                                </h2>
                                <p className="text-sm text-foreground-muted">
                                    Quick reference for all available shortcuts. Press ESC or Backspace to go back.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onBackToCommandPalette}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-foreground-muted bg-foreground/5 rounded hover:bg-foreground/10 transition-colors"
                                >
                                    <span className="text-xs">⌘K</span> Command Palette
                                </button>
                                <button
                                    type="button"
                                    onClick={onBackToCommandPalette}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-foreground-muted bg-foreground/5 rounded hover:bg-foreground/10 transition-colors"
                                >
                                    <span className="text-xs">ESC</span> Back
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="max-h-[400px] overflow-y-auto p-4">
                            <div className="grid gap-3">
                                {shortcuts.map((shortcut) => (
                                    <div
                                        key={`${shortcut.key}-${shortcut.description}`}
                                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-foreground/5 transition-colors"
                                    >
                                        <span className="text-sm text-foreground">{shortcut.description}</span>
                                        <kbd className="text-xs text-foreground-muted bg-foreground/10 px-2 py-1 rounded">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>

                            {/* Footer note */}
                            <div className="mt-6 p-3 bg-foreground/5 rounded-md">
                                <p className="text-xs text-foreground-muted text-center">
                                    💡 <strong>Tip:</strong> Type to search for commands in the command palette, or use
                                    the shortcuts above for quick navigation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
