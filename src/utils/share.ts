/**
 * Share utilities for Web Share API and clipboard
 *
 * Platform configuration is in src/data/shareButtons.ts
 */

/**
 * Check if Web Share API is available
 */
export function canShare(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Share content using Web Share API
 * Returns true if shared successfully, false if cancelled or failed
 */
export async function sharePost(data: { title: string; text: string; url: string }): Promise<boolean> {
    if (!canShare()) return false;

    try {
        await navigator.share(data);
        return true;
    } catch (err) {
        // User cancelled - not an error
        if ((err as Error).name === 'AbortError') return false;
        console.error('Share failed:', err);
        return false;
    }
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers or when clipboard API fails
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';
            document.body.appendChild(textarea);
            textarea.select();
            // execCommand is deprecated but intentionally kept as fallback for older browsers
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch {
            return false;
        }
    }
}
