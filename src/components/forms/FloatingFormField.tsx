import { useState } from 'react';

interface FloatingFormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'textarea';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    maxLength?: number;
    showCharCount?: boolean;
    charCountLabel?: string;
}

export function FloatingFormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    rows = 5,
    required = false,
    maxLength,
    showCharCount = false,
    charCountLabel = 'characters'
}: FloatingFormFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;
    const isFloating = isFocused || hasValue;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const charCount = value.length;
    const isNearLimit = maxLength && charCount >= maxLength * 0.9;
    const isAtLimit = maxLength && charCount >= maxLength;

    const baseInputClasses = `peer w-full px-3 pt-5 pb-1.5 border rounded-lg text-foreground text-sm placeholder-transparent focus:outline-none transition-all duration-300 ${error ? 'border-error focus:border-error' : 'border-foreground/20 focus:border-primary hover:border-foreground/40 focus:ring-1 focus:ring-primary/30'}`;

    const labelClasses = `
        absolute left-3
        transition-all duration-300 ease-out
        pointer-events-none
        ${isFloating ? 'top-1.5 text-[10px]' : 'top-1/2 -translate-y-1/2 text-sm'}
        ${type === 'textarea' && !isFloating ? 'top-3 translate-y-0' : ''}
        ${isFocused ? 'text-primary' : error ? 'text-error' : 'text-foreground-muted'}
    `;

    return (
        <div className="form-field relative">
            {type === 'textarea' ? (
                <div className="relative">
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        rows={rows}
                        maxLength={maxLength}
                        className={`${baseInputClasses} resize-none min-h-[100px]`}
                        style={{ backgroundColor: 'var(--input-field-bg)' }}
                        placeholder={placeholder}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                    />
                    <label
                        htmlFor={name}
                        className={`
                            absolute left-3
                            transition-all duration-300 ease-out
                            pointer-events-none
                            ${isFloating ? 'top-1.5 text-[10px]' : 'top-3 text-sm'}
                            ${isFocused ? 'text-primary' : error ? 'text-error' : 'text-foreground-muted'}
                        `}
                    >
                        {label} {required && <span className="text-error">*</span>}
                    </label>

                    {/* Character counter */}
                    {showCharCount && maxLength && (
                        <div className="absolute bottom-2 right-3 text-[10px] text-foreground-muted">
                            <span
                                className={`
                                ${isAtLimit ? 'text-error font-medium' : isNearLimit ? 'text-warning' : ''}
                            `}
                            >
                                {charCount}
                            </span>
                            /{maxLength} {charCountLabel}
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        maxLength={maxLength}
                        className={baseInputClasses}
                        style={{ backgroundColor: 'var(--input-field-bg)' }}
                        placeholder={placeholder}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                    />
                    <label htmlFor={name} className={labelClasses}>
                        {label} {required && <span className="text-error">*</span>}
                    </label>
                </div>
            )}

            {/* Error message with animation */}
            <div
                className={`
                    overflow-hidden transition-all duration-300
                    ${error ? 'max-h-10 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}
                `}
            >
                <p id={`${name}-error`} className="text-xs text-error flex items-center gap-1" role="alert">
                    <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {error}
                </p>
            </div>
        </div>
    );
}
