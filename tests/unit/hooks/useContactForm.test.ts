import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useContactForm } from '@/hooks/useContactForm';

// Mock isValidInterest
vi.mock('@/data', () => ({
    isValidInterest: vi.fn((interest: string) => {
        const validInterests = [
            'websiteDesign',
            'branding',
            'webDevelopment',
            'logoDesign',
            'appDevelopment',
            'automation',
            'seoOptimization',
            'performanceOptimization',
            'wordpressTheme',
            'wordpressPlugin',
            'wordpressMigration',
            'remote',
            'fulltime',
            'contractor'
        ];
        return validInterests.includes(interest);
    })
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useContactForm', () => {
    const defaultErrorMessages = {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        subjectRequired: 'Subject is required',
        messageRequired: 'Message is required',
        messageMinLength: 'Message must be at least 10 characters'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: {
                search: '',
                hash: ''
            },
            writable: true
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('initial state', () => {
        it('should have empty form data initially', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            expect(result.current.formData).toEqual({
                name: '',
                email: '',
                company: '',
                subject: '',
                interests: [],
                message: ''
            });
        });

        it('should have no errors initially', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            expect(result.current.errors).toEqual({});
        });

        it('should not be submitting initially', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            expect(result.current.isSubmitting).toBe(false);
        });

        it('should have idle submit status initially', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            expect(result.current.submitStatus).toBe('idle');
        });
    });

    describe('handleChange', () => {
        it('should update form data when input changes', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John Doe' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            expect(result.current.formData.name).toBe('John Doe');
        });

        it('should update email field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'email', value: 'john@example.com' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            expect(result.current.formData.email).toBe('john@example.com');
        });

        it('should update company field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'company', value: 'Acme Inc' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            expect(result.current.formData.company).toBe('Acme Inc');
        });

        it('should update subject field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'subject', value: 'Project Inquiry' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            expect(result.current.formData.subject).toBe('Project Inquiry');
        });

        it('should update message field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'message', value: 'Hello, I am interested in your services.' }
                } as React.ChangeEvent<HTMLTextAreaElement>);
            });

            expect(result.current.formData.message).toBe('Hello, I am interested in your services.');
        });

        it('should clear error for field when it changes', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            // Submit empty form to trigger errors
            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.name).toBe('Name is required');

            // Change the name field
            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            expect(result.current.errors.name).toBe('');
        });
    });

    describe('handleInterestsChange', () => {
        it('should update interests array', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleInterestsChange(['webDevelopment', 'branding']);
            });

            expect(result.current.formData.interests).toEqual(['webDevelopment', 'branding']);
        });

        it('should replace previous interests', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleInterestsChange(['webDevelopment']);
            });

            act(() => {
                result.current.handleInterestsChange(['branding', 'logoDesign']);
            });

            expect(result.current.formData.interests).toEqual(['branding', 'logoDesign']);
        });

        it('should handle empty interests array', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleInterestsChange(['webDevelopment']);
            });

            act(() => {
                result.current.handleInterestsChange([]);
            });

            expect(result.current.formData.interests).toEqual([]);
        });
    });

    describe('form validation', () => {
        it('should require name field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.name).toBe('Name is required');
        });

        it('should require email field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.email).toBe('Email is required');
        });

        it('should validate email format', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            act(() => {
                result.current.handleChange({
                    target: { name: 'email', value: 'invalid-email' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.email).toBe('Invalid email format');
        });

        it('should require subject field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'email', value: 'john@example.com' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.subject).toBe('Subject is required');
        });

        it('should require message field', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'email', value: 'john@example.com' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'subject', value: 'Test Subject' }
                } as React.ChangeEvent<HTMLInputElement>);
            });

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.message).toBe('Message is required');
        });

        it('should require message to be at least 10 characters', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'email', value: 'john@example.com' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'subject', value: 'Test Subject' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'message', value: 'Short' }
                } as React.ChangeEvent<HTMLTextAreaElement>);
            });

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.errors.message).toBe('Message must be at least 10 characters');
        });

        it('should accept valid email formats', () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            const validEmails = ['test@example.com', 'user.name@domain.co', 'user+tag@example.org'];

            for (const email of validEmails) {
                act(() => {
                    result.current.handleChange({
                        target: { name: 'email', value: email }
                    } as React.ChangeEvent<HTMLInputElement>);
                });

                act(() => {
                    result.current.handleChange({
                        target: { name: 'name', value: 'Test' }
                    } as React.ChangeEvent<HTMLInputElement>);
                    result.current.handleChange({
                        target: { name: 'subject', value: 'Test' }
                    } as React.ChangeEvent<HTMLInputElement>);
                    result.current.handleChange({
                        target: { name: 'message', value: 'This is a valid message' }
                    } as React.ChangeEvent<HTMLTextAreaElement>);
                });

                act(() => {
                    result.current.handleSubmit({
                        preventDefault: vi.fn()
                    } as unknown as React.FormEvent);
                });

                expect(result.current.errors.email).toBeUndefined();
            }
        });
    });

    describe('form submission', () => {
        const fillValidForm = (result: { current: ReturnType<typeof useContactForm> }) => {
            act(() => {
                result.current.handleChange({
                    target: { name: 'name', value: 'John Doe' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'email', value: 'john@example.com' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'subject', value: 'Project Inquiry' }
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleChange({
                    target: { name: 'message', value: 'This is a valid message with more than 10 characters.' }
                } as React.ChangeEvent<HTMLTextAreaElement>);
            });
        };

        it('should prevent default form submission', async () => {
            const preventDefault = vi.fn();
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            await act(async () => {
                result.current.handleSubmit({
                    preventDefault
                } as unknown as React.FormEvent);
            });

            expect(preventDefault).toHaveBeenCalled();
        });

        it('should not submit if validation fails', async () => {
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            await act(async () => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should set isSubmitting to true during submission', async () => {
            mockFetch.mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({ success: true }) }), 100)
                    )
            );

            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            fillValidForm(result);

            act(() => {
                result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.isSubmitting).toBe(true);
        });

        it('should call API with form data on successful validation', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            fillValidForm(result);

            await act(async () => {
                await result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: expect.any(String)
            });
        });

        it('should set success status on successful submission', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const onSuccess = vi.fn();
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages, onSuccess }));

            fillValidForm(result);

            await act(async () => {
                await result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.submitStatus).toBe('success');
            expect(onSuccess).toHaveBeenCalled();
        });

        it('should reset form data on successful submission', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            fillValidForm(result);

            await act(async () => {
                await result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.formData).toEqual({
                name: '',
                email: '',
                company: '',
                subject: '',
                interests: [],
                message: ''
            });
        });

        it('should set error status on failed submission', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ success: false, error: 'Server error' })
            });

            const onError = vi.fn();
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages, onError }));

            fillValidForm(result);

            await act(async () => {
                await result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.submitStatus).toBe('error');
            expect(onError).toHaveBeenCalled();
        });

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            const onError = vi.fn();
            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages, onError }));

            fillValidForm(result);

            await act(async () => {
                await result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.submitStatus).toBe('error');
            expect(onError).toHaveBeenCalled();
        });

        it('should reset isSubmitting after submission completes', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            fillValidForm(result);

            await act(async () => {
                await result.current.handleSubmit({
                    preventDefault: vi.fn()
                } as unknown as React.FormEvent);
            });

            expect(result.current.isSubmitting).toBe(false);
        });
    });

    describe('URL interests reading', () => {
        it('should read interests from URL query params', async () => {
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?interests=webDevelopment,branding',
                    hash: ''
                },
                writable: true
            });

            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            // Wait for the effect to run
            await waitFor(() => {
                expect(result.current.formData.interests).toContain('webDevelopment');
            });
        });

        it('should filter invalid interests from URL', async () => {
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?interests=webDevelopment,invalidInterest',
                    hash: ''
                },
                writable: true
            });

            const { result } = renderHook(() => useContactForm({ errorMessages: defaultErrorMessages }));

            await waitFor(() => {
                expect(result.current.formData.interests).toContain('webDevelopment');
                expect(result.current.formData.interests).not.toContain('invalidInterest');
            });
        });
    });
});
