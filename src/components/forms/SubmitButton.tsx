import sendIcon from '@/icons/ui/send.svg?raw';
import spinnerIcon from '@/icons/ui/spinner.svg?raw';

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
 * Displays a spinner icon and loading text when submitting, otherwise
 * shows a send icon with the normal button text. The button is automatically
 * disabled during loading.
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
                className="w-full px-5 py-3 bg-primary text-white text-sm rounded-lg font-medium hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                        <span dangerouslySetInnerHTML={{ __html: spinnerIcon }} />
                        {loadingText}
                    </>
                ) : (
                    <>
                        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                        <span dangerouslySetInnerHTML={{ __html: sendIcon }} />
                        {text}
                    </>
                )}
            </button>
        </div>
    );
}
