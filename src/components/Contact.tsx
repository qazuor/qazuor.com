import { useEffect, useRef } from 'react';
import { useContactForm } from '../hooks/useContactForm';
import { gsap } from '../lib/gsap';
import { FormField } from './FormField';
import { StatusMessage } from './StatusMessage';
import { SubmitButton } from './SubmitButton';

interface ContactProps {
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
  translations = {
    title: 'Get In Touch',
    subtitle: "Have a project in mind? Let's work together!",
    form: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
    },
    placeholders: {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'Tell me about your project...',
    },
    errors: {
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      subjectRequired: 'Subject is required',
      messageRequired: 'Message is required',
      messageMinLength: 'Message must be at least 10 characters',
    },
    success: 'Message sent successfully! I will get back to you soon.',
    error: 'Something went wrong. Please try again.',
  },
}: ContactProps) {
  const contactRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { formData, errors, isSubmitting, submitStatus, handleChange, handleSubmit } =
    useContactForm({
      errorMessages: translations.errors,
    });

  useEffect(() => {
    if (!contactRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // Animate section title
    const title = contactRef.current.querySelector('.section-title');
    if (title) {
      gsap.from(title, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate form fields
    const formFields = contactRef.current.querySelectorAll('.form-field');
    gsap.from(formFields, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: formFields[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <section className="section">
      <div className="container-custom" ref={contactRef}>
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="section-title mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">{translations.title}</span>
            </h2>
            <p className="text-foreground-secondary text-lg">{translations.subtitle}</p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
            {submitStatus === 'success' && (
              <StatusMessage type="success" message={translations.success} />
            )}
            {submitStatus === 'error' && (
              <StatusMessage type="error" message={translations.error} />
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
