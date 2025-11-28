import { Command } from 'lucide-react';

interface CommandButtonProps {
    ariaLabel?: string;
    className?: string;
}

export function CommandButton({ ariaLabel = 'Open command palette', className = '' }: CommandButtonProps) {
    const handleClick = () => {
        // Emit a custom event that the global CommandPalette can listen to
        const event = new CustomEvent('openCommandPalette', {
            detail: { source: 'button' }
        });
        window.dispatchEvent(event);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`p-1.5 rounded-lg text-foreground-secondary hover:bg-foreground/5 transition-colors duration-base ${className}`}
            aria-label={ariaLabel}
            title="⌘K"
        >
            <Command className="w-5 h-5" />
        </button>
    );
}
