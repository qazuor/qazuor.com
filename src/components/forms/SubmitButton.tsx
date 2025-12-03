import { UnifiedButton } from '@/components/ui/UnifiedButton';

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

// Send icon component (decorative, hidden from assistive technology)
const SendIcon = () => (
    <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

/**
 * Form submit button with loading state
 *
 * Uses UnifiedButton internally for consistent styling across the site.
 * Displays a spinner when submitting, otherwise shows a send icon.
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
            <UnifiedButton
                type="submit"
                variant="primary"
                size="md"
                loading={isLoading}
                fullWidth
                icon={<SendIcon />}
                iconPosition="left"
            >
                {isLoading ? loadingText : text}
            </UnifiedButton>
        </div>
    );
}
