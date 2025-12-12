import { useEffect, useRef, useState } from 'react';
import { isValidInterest } from '@/data';

interface FormData {
    name: string;
    email: string;
    company: string;
    subject: string;
    interests: string[];
    message: string;
}

interface ValidationErrors {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    subjectRequired: string;
    messageRequired: string;
    messageMinLength: string;
}

interface UseContactFormProps {
    errorMessages: ValidationErrors;
    onSuccess?: () => void;
    onError?: () => void;
}

export function useContactForm({ errorMessages, onSuccess, onError }: UseContactFormProps) {
    // AbortController ref to handle race conditions on multiple submits
    const abortControllerRef = useRef<AbortController | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        company: '',
        subject: '',
        interests: [],
        message: ''
    });

    // Read interests from URL query params on mount and after View Transitions
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const readInterestsFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const interestsParam = params.get('interests');

            if (interestsParam) {
                const interestsFromUrl = interestsParam
                    .split(',')
                    .map((i) => i.trim())
                    .filter(isValidInterest);

                if (interestsFromUrl.length > 0) {
                    setFormData((prev) => ({ ...prev, interests: interestsFromUrl }));
                }
            }
        };

        const focusFirstInput = () => {
            // Focus the first input if URL has #contact hash
            if (window.location.hash === '#contact') {
                // Small delay to ensure the form is rendered and scrolled into view
                setTimeout(() => {
                    const firstInput = document.querySelector<HTMLInputElement>('#contact input[name="name"]');
                    firstInput?.focus();
                }, 150);
            }
        };

        // Read on initial mount
        readInterestsFromUrl();
        focusFirstInput();

        // Also read after a small delay (for client:visible hydration timing)
        const timeoutId = setTimeout(readInterestsFromUrl, 100);

        // Listen for View Transitions navigation
        // Uses custom event dispatched by ViewTransitionGSAP after DOM swap
        const handlePageLoad = () => {
            // Small delay to ensure React component is ready after View Transition
            setTimeout(() => {
                readInterestsFromUrl();
                focusFirstInput();
            }, 50);
        };

        document.addEventListener('qazuor:content-ready', handlePageLoad);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('qazuor:content-ready', handlePageLoad);
        };
    }, []);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = errorMessages.nameRequired;
        }

        if (!formData.email.trim()) {
            newErrors.email = errorMessages.emailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = errorMessages.emailInvalid;
        }

        if (!formData.subject.trim()) {
            newErrors.subject = errorMessages.subjectRequired;
        }

        if (!formData.message.trim()) {
            newErrors.message = errorMessages.messageRequired;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = errorMessages.messageMinLength;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleInterestsChange = (interests: string[]) => {
        setFormData((prev) => ({ ...prev, interests }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Cancel any in-flight request to prevent race conditions
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                signal: abortControllerRef.current.signal
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to send message');
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', company: '', subject: '', interests: [], message: '' });
            onSuccess?.();
        } catch (error) {
            // Don't update state if the request was aborted (component unmounted or new request started)
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            setSubmitStatus('error');
            onError?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup: abort any pending request on unmount
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    return {
        formData,
        errors,
        isSubmitting,
        submitStatus,
        handleChange,
        handleInterestsChange,
        handleSubmit
    };
}
