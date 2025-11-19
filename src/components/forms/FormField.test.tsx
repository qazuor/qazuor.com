import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from './FormField';

describe('FormField Component', () => {
    const defaultProps = {
        label: 'Test Label',
        name: 'testField',
        value: '',
        onChange: vi.fn()
    };

    describe('Text Input', () => {
        it('should render text input by default', () => {
            render(<FormField {...defaultProps} />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
        });

        it('should render label with correct text', () => {
            render(<FormField {...defaultProps} />);
            expect(screen.getByText('Test Label')).toBeInTheDocument();
        });

        it('should connect label to input with htmlFor/id', () => {
            render(<FormField {...defaultProps} />);

            const label = screen.getByText('Test Label');
            const input = screen.getByLabelText('Test Label');

            expect(label).toHaveAttribute('for', 'testField');
            expect(input).toHaveAttribute('id', 'testField');
        });

        it('should render with provided value', () => {
            render(<FormField {...defaultProps} value="Test Value" />);

            const input = screen.getByLabelText('Test Label') as HTMLInputElement;
            expect(input.value).toBe('Test Value');
        });

        it('should call onChange when typing', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<FormField {...defaultProps} onChange={handleChange} />);

            const input = screen.getByLabelText('Test Label');
            await user.type(input, 'a');

            expect(handleChange).toHaveBeenCalled();
        });

        it('should render placeholder text', () => {
            render(<FormField {...defaultProps} placeholder="Enter text here" />);

            const input = screen.getByPlaceholderText('Enter text here');
            expect(input).toBeInTheDocument();
        });

        it('should show required asterisk when required is true', () => {
            render(<FormField {...defaultProps} required />);
            expect(screen.getByText(/\*/)).toBeInTheDocument();
        });

        it('should not show asterisk when required is false', () => {
            render(<FormField {...defaultProps} required={false} />);

            const labelText = screen.getByText('Test Label').textContent;
            expect(labelText).not.toContain('*');
        });
    });

    describe('Email Input', () => {
        it('should render email input when type is email', () => {
            render(<FormField {...defaultProps} type="email" />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveAttribute('type', 'email');
        });

        it('should call onChange with email input', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<FormField {...defaultProps} type="email" onChange={handleChange} />);

            const input = screen.getByLabelText('Test Label');
            await user.type(input, 'test@example.com');

            expect(handleChange).toHaveBeenCalled();
        });
    });

    describe('Textarea', () => {
        it('should render textarea when type is textarea', () => {
            render(<FormField {...defaultProps} type="textarea" />);

            const textarea = screen.getByLabelText('Test Label');
            expect(textarea.tagName).toBe('TEXTAREA');
        });

        it('should render textarea with default 6 rows', () => {
            render(<FormField {...defaultProps} type="textarea" />);

            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveAttribute('rows', '6');
        });

        it('should render textarea with custom rows', () => {
            render(<FormField {...defaultProps} type="textarea" rows={10} />);

            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveAttribute('rows', '10');
        });

        it('should call onChange when typing in textarea', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<FormField {...defaultProps} type="textarea" onChange={handleChange} />);

            const textarea = screen.getByLabelText('Test Label');
            await user.type(textarea, 'Multi\nline\ntext');

            expect(handleChange).toHaveBeenCalled();
        });

        it('should have resize-none class for textarea', () => {
            render(<FormField {...defaultProps} type="textarea" />);

            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveClass('resize-none');
        });
    });

    describe('Error State', () => {
        it('should not show error message when no error', () => {
            render(<FormField {...defaultProps} />);

            const errorMessage = screen.queryByText(/error/i);
            expect(errorMessage).not.toBeInTheDocument();
        });

        it('should display error message when error is provided', () => {
            render(<FormField {...defaultProps} error="This field is required" />);

            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('should apply error border class when error exists', () => {
            render(<FormField {...defaultProps} error="Error message" />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('border-error');
        });

        it('should not apply error border class when no error', () => {
            render(<FormField {...defaultProps} />);

            const input = screen.getByLabelText('Test Label');
            expect(input).not.toHaveClass('border-error');
            expect(input).toHaveClass('border-foreground/10');
        });

        it('should display error with correct styling', () => {
            render(<FormField {...defaultProps} error="Error message" />);

            const errorElement = screen.getByText('Error message');
            expect(errorElement).toHaveClass('text-error');
            expect(errorElement).toHaveClass('text-sm');
            expect(errorElement).toHaveClass('mt-1');
        });
    });

    describe('Styling', () => {
        it('should apply form-field class to wrapper', () => {
            const { container } = render(<FormField {...defaultProps} />);
            const wrapper = container.querySelector('.form-field');
            expect(wrapper).toBeInTheDocument();
        });

        it('should apply consistent base classes to input', () => {
            render(<FormField {...defaultProps} />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('w-full');
            expect(input).toHaveClass('px-4');
            expect(input).toHaveClass('py-3');
            expect(input).toHaveClass('bg-background-secondary');
            expect(input).toHaveClass('rounded-lg');
        });

        it('should apply focus styles classes', () => {
            render(<FormField {...defaultProps} />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('focus:outline-none');
            expect(input).toHaveClass('focus:ring-2');
            expect(input).toHaveClass('focus:ring-primary');
        });

        it('should apply transition classes', () => {
            render(<FormField {...defaultProps} />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveClass('transition-all');
            expect(input).toHaveClass('duration-300');
        });
    });

    describe('Name Attribute', () => {
        it('should set correct name attribute on input', () => {
            render(<FormField {...defaultProps} name="username" />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveAttribute('name', 'username');
        });

        it('should set correct name attribute on textarea', () => {
            render(<FormField {...defaultProps} type="textarea" name="message" />);

            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveAttribute('name', 'message');
        });
    });

    describe('Integration Scenarios', () => {
        it('should handle complete form field with all props', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(
                <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value="test@example.com"
                    onChange={handleChange}
                    error="Invalid email format"
                    placeholder="you@example.com"
                    required
                />
            );

            // Check label with required asterisk
            expect(screen.getByText(/Email Address/)).toBeInTheDocument();
            expect(screen.getByText(/\*/)).toBeInTheDocument();

            // Check input attributes
            const input = screen.getByLabelText(/Email Address/) as HTMLInputElement;
            expect(input).toHaveAttribute('type', 'email');
            expect(input).toHaveAttribute('name', 'email');
            expect(input).toHaveAttribute('placeholder', 'you@example.com');
            expect(input.value).toBe('test@example.com');

            // Check error state
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
            expect(input).toHaveClass('border-error');

            // Check onChange functionality
            await user.clear(input);
            expect(handleChange).toHaveBeenCalled();
        });

        it('should handle textarea with error and placeholder', () => {
            render(
                <FormField
                    label="Message"
                    name="message"
                    type="textarea"
                    value=""
                    onChange={vi.fn()}
                    error="Message is too short"
                    placeholder="Enter your message"
                    rows={8}
                    required
                />
            );

            const textarea = screen.getByLabelText(/Message/);
            expect(textarea.tagName).toBe('TEXTAREA');
            expect(textarea).toHaveAttribute('rows', '8');
            expect(textarea).toHaveAttribute('placeholder', 'Enter your message');
            expect(screen.getByText('Message is too short')).toBeInTheDocument();
        });

        it('should clear error when value changes', async () => {
            const handleChange = vi.fn();
            const _user = userEvent.setup();

            const { rerender } = render(<FormField {...defaultProps} error="Required field" onChange={handleChange} />);

            // Error is displayed
            expect(screen.getByText('Required field')).toBeInTheDocument();

            // Simulate fixing the error
            rerender(<FormField {...defaultProps} value="Fixed value" error={undefined} onChange={handleChange} />);

            // Error should be gone
            expect(screen.queryByText('Required field')).not.toBeInTheDocument();
        });
    });
});
