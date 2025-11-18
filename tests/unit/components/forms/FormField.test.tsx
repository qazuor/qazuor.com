import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from '@/components/forms/FormField';

describe('FormField Component', () => {
    const defaultProps = {
        label: 'Test Label',
        name: 'test-field',
        value: '',
        onChange: vi.fn()
    };

    describe('Basic Rendering', () => {
        it('renders text input by default', () => {
            render(<FormField {...defaultProps} />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toBeInTheDocument();
            expect(input.tagName).toBe('INPUT');
        });

        it('renders label with correct text', () => {
            render(<FormField {...defaultProps} label="Email Address" />);
            expect(screen.getByText('Email Address')).toBeInTheDocument();
        });

        it('renders with placeholder text', () => {
            render(<FormField {...defaultProps} placeholder="Enter your name" />);
            const input = screen.getByPlaceholderText('Enter your name');
            expect(input).toBeInTheDocument();
        });

        it('renders with initial value', () => {
            render(<FormField {...defaultProps} value="Initial value" />);
            const input = screen.getByLabelText('Test Label') as HTMLInputElement;
            expect(input.value).toBe('Initial value');
        });
    });

    describe('Input Types', () => {
        it('renders text input', () => {
            render(<FormField {...defaultProps} type="text" />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveAttribute('type', 'text');
        });

        it('renders email input', () => {
            render(<FormField {...defaultProps} type="email" label="Email" />);
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('type', 'email');
        });

        it('renders textarea', () => {
            render(<FormField {...defaultProps} type="textarea" />);
            const textarea = screen.getByLabelText('Test Label');
            expect(textarea.tagName).toBe('TEXTAREA');
        });

        it('renders textarea with custom rows', () => {
            render(<FormField {...defaultProps} type="textarea" rows={10} />);
            const textarea = screen.getByLabelText('Test Label') as HTMLTextAreaElement;
            expect(textarea.rows).toBe(10);
        });

        it('renders textarea with default rows when not specified', () => {
            render(<FormField {...defaultProps} type="textarea" />);
            const textarea = screen.getByLabelText('Test Label') as HTMLTextAreaElement;
            expect(textarea.rows).toBe(6);
        });
    });

    describe('Required Field', () => {
        it('shows asterisk when required is true', () => {
            render(<FormField {...defaultProps} required={true} />);
            expect(screen.getByText(/\*/)).toBeInTheDocument();
        });

        it('does not show asterisk when required is false', () => {
            render(<FormField {...defaultProps} required={false} />);
            const label = screen.getByText('Test Label');
            expect(label.textContent).toBe('Test Label');
        });

        it('does not show asterisk by default', () => {
            render(<FormField {...defaultProps} />);
            const label = screen.getByText('Test Label');
            expect(label.textContent).toBe('Test Label');
        });
    });

    describe('Error Handling', () => {
        it('displays error message when provided', () => {
            const errorMsg = 'This field is required';
            render(<FormField {...defaultProps} error={errorMsg} />);
            expect(screen.getByText(errorMsg)).toBeInTheDocument();
        });

        it('does not display error message when not provided', () => {
            render(<FormField {...defaultProps} />);
            const errorElement = document.querySelector('.text-error');
            expect(errorElement).not.toBeInTheDocument();
        });

        it('applies error styling when error is present', () => {
            render(<FormField {...defaultProps} error="Error message" />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('border-error');
        });

        it('applies normal styling when no error', () => {
            render(<FormField {...defaultProps} />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('border-foreground/10');
            expect(input).not.toHaveClass('border-error');
        });

        it('error message has correct styling classes', () => {
            render(<FormField {...defaultProps} error="Test error" />);
            const errorElement = screen.getByText('Test error');
            expect(errorElement).toHaveClass('text-sm', 'text-error');
        });
    });

    describe('User Interactions', () => {
        it('calls onChange when text input value changes', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<FormField {...defaultProps} onChange={handleChange} />);

            const input = screen.getByLabelText('Test Label');
            await user.type(input, 'Hello');

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledTimes(5); // Once per character
        });

        it('calls onChange when textarea value changes', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<FormField {...defaultProps} type="textarea" onChange={handleChange} />);

            const textarea = screen.getByLabelText('Test Label');
            await user.type(textarea, 'Test');

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledTimes(4);
        });

        it('calls onChange with correct event data', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<FormField {...defaultProps} onChange={handleChange} />);

            const input = screen.getByLabelText('Test Label');
            await user.type(input, 'A');

            expect(handleChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: expect.objectContaining({
                        name: 'test-field',
                        value: 'A'
                    })
                })
            );
        });

        it('updates value on input change', async () => {
            const user = userEvent.setup();
            let currentValue = '';
            const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                currentValue = e.target.value;
            };

            const { rerender } = render(<FormField {...defaultProps} value={currentValue} onChange={handleChange} />);

            const input = screen.getByLabelText('Test Label') as HTMLInputElement;
            await user.type(input, 'Test');

            rerender(<FormField {...defaultProps} value={currentValue} onChange={handleChange} />);
            expect(currentValue).toBe('Test');
        });
    });

    describe('Accessibility', () => {
        it('associates label with input using htmlFor/id', () => {
            render(<FormField {...defaultProps} name="email-field" label="Email" />);
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('id', 'email-field');
        });

        it('input has correct name attribute', () => {
            render(<FormField {...defaultProps} name="username" />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveAttribute('name', 'username');
        });

        it('textarea has correct id and name attributes', () => {
            render(<FormField {...defaultProps} type="textarea" name="message" />);
            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveAttribute('id', 'message');
            expect(textarea).toHaveAttribute('name', 'message');
        });
    });

    describe('Styling Classes', () => {
        it('applies base styling classes to input', () => {
            render(<FormField {...defaultProps} />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('w-full', 'px-4', 'py-3', 'rounded-lg');
        });

        it('applies base styling classes to textarea', () => {
            render(<FormField {...defaultProps} type="textarea" />);
            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveClass('w-full', 'px-4', 'py-3', 'rounded-lg');
        });

        it('applies resize-none class to textarea', () => {
            render(<FormField {...defaultProps} type="textarea" />);
            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveClass('resize-none');
        });

        it('label has correct styling classes', () => {
            render(<FormField {...defaultProps} />);
            const label = screen.getByText('Test Label').closest('label');
            expect(label).toHaveClass('block', 'text-sm', 'font-medium');
        });

        it('wrapper div has form-field class', () => {
            const { container } = render(<FormField {...defaultProps} />);
            const wrapper = container.querySelector('.form-field');
            expect(wrapper).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('handles empty string value', () => {
            render(<FormField {...defaultProps} value="" />);
            const input = screen.getByLabelText('Test Label') as HTMLInputElement;
            expect(input.value).toBe('');
        });

        it('handles long text values', () => {
            const longText = 'A'.repeat(1000);
            render(<FormField {...defaultProps} value={longText} />);
            const input = screen.getByLabelText('Test Label') as HTMLInputElement;
            expect(input.value).toBe(longText);
        });

        it('handles special characters in value', () => {
            const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            render(<FormField {...defaultProps} value={specialChars} />);
            const input = screen.getByLabelText('Test Label') as HTMLInputElement;
            expect(input.value).toBe(specialChars);
        });

        it('handles multiple errors displayed', () => {
            render(<FormField {...defaultProps} error="Error 1\nError 2" />);
            expect(screen.getByText('Error 1\nError 2')).toBeInTheDocument();
        });
    });
});
