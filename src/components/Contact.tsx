import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const hasAnimated = useRef(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = translations.errors.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = translations.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = translations.errors.emailInvalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = translations.errors.subjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = translations.errors.messageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = translations.errors.messageMinLength;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simular envío (en producción, aquí iría el endpoint real)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Aquí iría la lógica real de envío
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (_error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* Name */}
            <div className="form-field">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                {translations.form.name} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-background-secondary border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
                  errors.name ? 'border-error' : 'border-foreground/10 focus:border-primary'
                }`}
                placeholder={translations.placeholders.name}
              />
              {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-field">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                {translations.form.email} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-background-secondary border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
                  errors.email ? 'border-error' : 'border-foreground/10 focus:border-primary'
                }`}
                placeholder={translations.placeholders.email}
              />
              {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
            </div>

            {/* Subject */}
            <div className="form-field">
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                {translations.form.subject} *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-background-secondary border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
                  errors.subject ? 'border-error' : 'border-foreground/10 focus:border-primary'
                }`}
                placeholder={translations.placeholders.subject}
              />
              {errors.subject && <p className="mt-1 text-sm text-error">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div className="form-field">
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                {translations.form.message} *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 bg-background-secondary border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none ${
                  errors.message ? 'border-error' : 'border-foreground/10 focus:border-primary'
                }`}
                placeholder={translations.placeholders.message}
              />
              {errors.message && <p className="mt-1 text-sm text-error">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="form-field">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-primary flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {translations.form.sending}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {translations.form.send}
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success flex items-start gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{translations.success}</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error flex items-start gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{translations.error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
