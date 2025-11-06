import sendIcon from '../icons/ui/send.svg?raw';
import spinnerIcon from '../icons/ui/spinner.svg?raw';

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  text: string;
}

export function SubmitButton({ isLoading, loadingText, text }: SubmitButtonProps) {
  return (
    <div className="form-field">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-primary flex items-center justify-center gap-2"
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
