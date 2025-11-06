interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  rows = 6,
  required = false,
}: FormFieldProps) {
  const baseClassName = `w-full px-4 py-3 bg-background-secondary border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
    error ? 'border-error' : 'border-foreground/10 focus:border-primary'
  }`;

  return (
    <div className="form-field">
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
        {label} {required && '*'}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${baseClassName} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClassName}
          placeholder={placeholder}
        />
      )}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
