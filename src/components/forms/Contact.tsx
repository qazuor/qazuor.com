import { useContactForm, useScrollAnimation, useStaggerAnimation } from '../../hooks';
import { FormField } from './FormField';
import { StatusMessage } from './StatusMessage';
import { SubmitButton } from './SubmitButton';

interface ContactProps {
    primaryColor?: string;
    translations?: {
        title: string;
        subtitle: string;
        form: {
            name: string;
            email: string;
            subject: string;
            message: string;
            send: string;
            sending: string;
        };
        placeholders: {
            name: string;
            email: string;
            subject: string;
            message: string;
        };
        errors: {
            nameRequired: string;
            emailRequired: string;
            emailInvalid: string;
            subjectRequired: string;
            messageRequired: string;
            messageMinLength: string;
        };
        success: string;
        error: string;
    };
}

export function Contact({
    primaryColor = '#ec4899',
    translations = {
        title: 'Get In Touch',
        subtitle: "Have a project in mind? Let's work together!",
        form: {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            send: 'Send Message',
            sending: 'Sending...'
        },
        placeholders: {
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Project Inquiry',
            message: 'Tell me about your project...'
        },
        errors: {
            nameRequired: 'Name is required',
            emailRequired: 'Email is required',
            emailInvalid: 'Invalid email format',
            subjectRequired: 'Subject is required',
            messageRequired: 'Message is required',
            messageMinLength: 'Message must be at least 10 characters'
        },
        success: 'Message sent successfully! I will get back to you soon.',
        error: 'Something went wrong. Please try again.'
    }
}: ContactProps) {
    const { formData, errors, isSubmitting, submitStatus, handleChange, handleSubmit } = useContactForm({
        errorMessages: translations.errors
    });

    // Animations
    const titleRef = useScrollAnimation('.section-title', { y: 30, duration: 0.8 });
    const formRef = useStaggerAnimation<HTMLFormElement>('.form-field', {
        y: 20,
        duration: 0.6,
        stagger: 0.1
    });

    return (
        <section className="section section-indigo" id="contact" style={{ backgroundColor: primaryColor }}>
            <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                    {/* Section Title */}
                    <div ref={titleRef} className="mb-12">
                        <div className="section-title text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="gradient-text">{translations.title}</span>
                            </h2>
                            <p className="text-foreground-secondary text-lg">{translations.subtitle}</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label={translations.form.name}
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder={translations.placeholders.name}
                            required
                        />

                        <FormField
                            label={translations.form.email}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder={translations.placeholders.email}
                            required
                        />

                        <FormField
                            label={translations.form.subject}
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleChange}
                            error={errors.subject}
                            placeholder={translations.placeholders.subject}
                            required
                        />

                        <FormField
                            label={translations.form.message}
                            name="message"
                            type="textarea"
                            value={formData.message}
                            onChange={handleChange}
                            error={errors.message}
                            placeholder={translations.placeholders.message}
                            rows={6}
                            required
                        />

                        <SubmitButton
                            isLoading={isSubmitting}
                            loadingText={translations.form.sending}
                            text={translations.form.send}
                        />

                        {/* Status Messages */}
                        {submitStatus === 'success' && <StatusMessage type="success" message={translations.success} />}
                        {submitStatus === 'error' && <StatusMessage type="error" message={translations.error} />}
                    </form>
                </div>
            </div>
        </section>
    );
}
