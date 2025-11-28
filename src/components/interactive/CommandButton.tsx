import commandIcon from '@/icons/ui/command.svg?raw';

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
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
            <span dangerouslySetInnerHTML={{ __html: commandIcon }} />
        </button>
    );
}
