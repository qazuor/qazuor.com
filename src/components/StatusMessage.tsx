import checkCircleIcon from '../icons/ui/check-circle.svg?raw';
import xCircleIcon from '../icons/ui/x-circle.svg?raw';

/**
 * Props for the StatusMessage component
 */
interface StatusMessageProps {
  /** Type of status message */
  type: 'success' | 'error';
  /** Message text to display */
  message: string;
}

/**
 * Status message component for form feedback
 *
 * Displays success or error messages with appropriate styling and icons.
 * Used to provide visual feedback after form submission.
 *
 * @example
 * ```tsx
 * {submitStatus === 'success' && (
 *   <StatusMessage
 *     type="success"
 *     message="Message sent successfully!"
 *   />
 * )}
 * ```
 */
export function StatusMessage({ type, message }: StatusMessageProps) {
  const isSuccess = type === 'success';

  return (
    <div
      className={`p-4 border rounded-lg flex items-start gap-3 ${
        isSuccess
          ? 'bg-success/10 border-success/20 text-success'
          : 'bg-error/10 border-error/20 text-error'
      }`}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
      <span dangerouslySetInnerHTML={{ __html: isSuccess ? checkCircleIcon : xCircleIcon }} />
      <p>{message}</p>
    </div>
  );
}
