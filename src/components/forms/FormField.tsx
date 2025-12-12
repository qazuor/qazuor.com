import { memo } from 'react';

/**
 * Props for the FormField component
 */
interface FormFieldProps {
    /** Label text displayed above the input */
    label: string;
    /** Input name attribute for form handling */
    name: string;
    /** Type of input field (default: 'text') */
    type?: 'text' | 'email' | 'textarea';
    /** Current value of the input */
    value: string;
    /** Change handler for input events */
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /** Error message to display below the input */
    error?: string;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Number of rows for textarea (default: 6) */
    rows?: number;
    /** Whether the field is required (default: false) */
    required?: boolean;
}

/**
 * Reusable form field component with validation support
 *
 * Supports text input, email input, and textarea with consistent styling
 * and error handling.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Name"
 *   name="name"
 *   value={formData.name}
 *   onChange={handleChange}
 *   error={errors.name}
 *   required
 * />
 * ```
 */
export const FormField = memo(function FormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    rows = 6,
    required = false
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
});
