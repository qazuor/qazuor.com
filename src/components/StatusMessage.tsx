import checkCircleIcon from '../icons/ui/check-circle.svg?raw';
import xCircleIcon from '../icons/ui/x-circle.svg?raw';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

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
