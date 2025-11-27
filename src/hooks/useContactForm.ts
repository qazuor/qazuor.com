import { useEffect, useState } from 'react';
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

        // Listen for Astro View Transitions navigation
        const handlePageLoad = () => {
            // Small delay to ensure React component is ready after View Transition
            setTimeout(() => {
                readInterestsFromUrl();
                focusFirstInput();
            }, 50);
        };

        document.addEventListener('astro:page-load', handlePageLoad);
        document.addEventListener('astro:after-swap', handlePageLoad);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('astro:page-load', handlePageLoad);
            document.removeEventListener('astro:after-swap', handlePageLoad);
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

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to send message');
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', company: '', subject: '', interests: [], message: '' });
            onSuccess?.();
        } catch (_error) {
            setSubmitStatus('error');
            onError?.();
        } finally {
            setIsSubmitting(false);
        }
    };

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
