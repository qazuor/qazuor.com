import { INTEREST_IDS, type InterestId } from '@/data';
import { useContactForm, useScrollAnimation, useStaggerAnimation } from '@/hooks';
import { ContactInfo } from './ContactInfo';
import { FloatingFormField } from './FloatingFormField';
import { InterestSelector } from './InterestSelector';
import { StatusMessage } from './StatusMessage';
import { SubmitButton } from './SubmitButton';

interface Interest {
    id: string;
    label: string;
}

interface ContactProps {
    contactData?: {
        email: string;
        phone: string;
        location: string;
        social: {
            github: string;
            linkedin: string;
            whatsapp: string;
            mail: string;
        };
    };
    translations?: {
        title: string;
        subtitle: string;
        description?: string;
        info: {
            title: string;
            description: string;
            email: string;
            phone: string;
            location: string;
            orConnect: string;
        };
        form: {
            name: string;
            email: string;
            company: string;
            subject: string;
            interest: string;
            message: string;
            charCount: string;
            send: string;
            sending: string;
        };
        placeholders: {
            name: string;
            email: string;
            company: string;
            subject: string;
            message: string;
        };
        interests: {
            websiteDesign: string;
            branding: string;
            webDevelopment: string;
            logoDesign: string;
            appDevelopment: string;
            automation: string;
            seoOptimization: string;
            performanceOptimization: string;
            wordpressTheme: string;
            wordpressPlugin: string;
            wordpressMigration: string;
            remote: string;
            fulltime: string;
            contractor: string;
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
    ariaLabels?: {
        github: string;
        linkedin: string;
        whatsapp: string;
        mail: string;
    };
}

export function Contact({
    contactData = {
        email: '',
        phone: '',
        location: '',
        social: {
            github: '',
            linkedin: '',
            whatsapp: '',
            mail: ''
        }
    },
    translations = {
        title: 'Get In Touch',
        subtitle: "Have a project in mind? Let's work together!",
        description: '',
        info: {
            title: "Let's Talk",
            description: "I'm open to any job opportunity: freelance, remote, full-time or collaborations.",
            email: 'Email',
            phone: 'Phone',
            location: 'Location',
            orConnect: 'Or connect via'
        },
        form: {
            name: 'Name',
            email: 'Email',
            company: 'Company',
            subject: 'Subject',
            interest: "What's on your mind?",
            message: 'Message',
            charCount: 'characters',
            send: 'Send Message',
            sending: 'Sending...'
        },
        placeholders: {
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Your company (optional)',
            subject: 'Project Inquiry',
            message: 'Tell me about your project...'
        },
        interests: {
            websiteDesign: 'Website Design',
            branding: 'Branding',
            webDevelopment: 'Web Development',
            logoDesign: 'Logo Design',
            appDevelopment: 'App Development',
            automation: 'Automation & Integrations',
            seoOptimization: 'SEO Optimization',
            performanceOptimization: 'Performance Optimization',
            wordpressTheme: 'WordPress Theme',
            wordpressPlugin: 'WordPress Plugin',
            wordpressMigration: 'WordPress Migration',
            remote: 'Remote Work',
            fulltime: 'Full-time Employee',
            contractor: 'Contractor'
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
    },
    ariaLabels = {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        whatsapp: 'WhatsApp',
        mail: 'Email'
    }
}: ContactProps) {
    const { formData, errors, isSubmitting, submitStatus, handleChange, handleInterestsChange, handleSubmit } =
        useContactForm({
            errorMessages: translations.errors
        });

    // Build interests array from centralized data
    const interests: Interest[] = INTEREST_IDS.map((id: InterestId) => ({
        id,
        label: translations.interests[id]
    }));

    // Animations
    const titleRef = useScrollAnimation('.section-title', { y: 30, duration: 0.8 });
    const formRef = useStaggerAnimation<HTMLFormElement>('.form-field', {
        y: 20,
        duration: 0.6,
        stagger: 0.1
    });

    return (
        <section className="relative pt-16 pb-32 md:pt-20 md:pb-40" id="contact">
            <div className="container-custom">
                {/* Section Title */}
                <div ref={titleRef} className="mb-10 md:mb-14">
                    <div className="section-title text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            <span className="gradient-text">{translations.title}</span>
                        </h2>
                        <p className="text-foreground-secondary text-sm md:text-base max-w-xl mx-auto">
                            {translations.subtitle}
                        </p>
                    </div>
                </div>

                {/* Split Layout: Info + Form Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
                    {/* Left Column: Contact Info */}
                    <div className="lg:pt-4">
                        <ContactInfo
                            email={contactData.email}
                            phone={contactData.phone}
                            location={contactData.location}
                            social={contactData.social}
                            translations={{
                                title: translations.info.title,
                                description: translations.info.description,
                                sectionDescription: translations.description,
                                emailLabel: translations.info.email,
                                phoneLabel: translations.info.phone,
                                locationLabel: translations.info.location,
                                orConnect: translations.info.orConnect
                            }}
                            ariaLabels={ariaLabels}
                        />
                    </div>

                    {/* Right Column: Elevated Form Card */}
                    <div>
                        <div
                            className="
                                relative z-10
                                bg-background
                                rounded-2xl
                                shadow-xl shadow-foreground/5
                                border border-foreground/5
                                p-6 md:p-8
                                mb-[-80px] md:mb-[-100px]
                            "
                        >
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                {/* Name & Email in 2 columns */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FloatingFormField
                                        label={translations.form.name}
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        placeholder={translations.placeholders.name}
                                        required
                                    />

                                    <FloatingFormField
                                        label={translations.form.email}
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        placeholder={translations.placeholders.email}
                                        required
                                    />
                                </div>

                                {/* Company */}
                                <FloatingFormField
                                    label={translations.form.company}
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder={translations.placeholders.company}
                                />

                                {/* Subject */}
                                <FloatingFormField
                                    label={translations.form.subject}
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    error={errors.subject}
                                    placeholder={translations.placeholders.subject}
                                    required
                                />

                                {/* Interest Selector */}
                                <InterestSelector
                                    label={translations.form.interest}
                                    interests={interests}
                                    selectedInterests={formData.interests}
                                    onChange={handleInterestsChange}
                                />

                                {/* Message with char counter */}
                                <FloatingFormField
                                    label={translations.form.message}
                                    name="message"
                                    type="textarea"
                                    value={formData.message}
                                    onChange={handleChange}
                                    error={errors.message}
                                    placeholder={translations.placeholders.message}
                                    rows={4}
                                    required
                                    maxLength={500}
                                    showCharCount
                                    charCountLabel={translations.form.charCount}
                                />

                                <div className="pt-2">
                                    <SubmitButton
                                        isLoading={isSubmitting}
                                        loadingText={translations.form.sending}
                                        text={translations.form.send}
                                    />
                                </div>

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
                </div>
            </div>
        </section>
    );
}
