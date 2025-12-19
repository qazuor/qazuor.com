import { clsx } from 'clsx';

/**
 * Props for the SubmitButton component
 */
interface SubmitButtonProps {
    /** Whether the form is currently submitting */
    isLoading: boolean;
    /** Text to display while loading */
    loadingText: string;
    /** Normal button text */
    text: string;
}

/**
 * Form submit button with loading state
 *
 * Simplified button component for form submission with loading indicator.
 *
 * @example
 * ```tsx
 * <SubmitButton
 *   isLoading={isSubmitting}
 *   text="Send Message"
 *   loadingText="Sending..."
 * />
 * ```
 */
export function SubmitButton({ isLoading, loadingText, text }: SubmitButtonProps) {
    return (
        <div className="form-field">
            <button
                type="submit"
                disabled={isLoading}
                className={clsx(
                    // UnifiedButton primary styles
                    'btn-unified-primary',
                    // Full width and sizing
                    'group w-full px-6 py-3 text-base',
                    // Focus
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    // Disabled state
                    isLoading && 'opacity-50 cursor-not-allowed pointer-events-none'
                )}
                aria-disabled={isLoading || undefined}
            >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                    {isLoading ? loadingText : text}
                </span>
            </button>
        </div>
    );
}
