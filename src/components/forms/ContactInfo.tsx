import githubIcon from '@/icons/social/github.svg?raw';
import linkedinIcon from '@/icons/social/linkedin.svg?raw';
import mailIcon from '@/icons/social/mail.svg?raw';
import whatsappIcon from '@/icons/social/whatsapp.svg?raw';

interface ContactInfoProps {
    email: string;
    phone: string;
    location: string;
    social: {
        github: string;
        linkedin: string;
        whatsapp: string;
        mail: string;
    };
    translations: {
        title: string;
        description: string;
        sectionDescription?: string;
        emailLabel: string;
        phoneLabel: string;
        locationLabel: string;
        orConnect: string;
    };
    ariaLabels: {
        github: string;
        linkedin: string;
        whatsapp: string;
        mail: string;
    };
}

interface InfoItemProps {
    icon: string;
    label: string;
    value: string;
    href?: string;
    isExternal?: boolean;
}

function InfoItem({ icon, label, value, href, isExternal }: InfoItemProps) {
    const content = (
        <div className="group flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/10 flex items-center justify-center text-primary transition-all duration-base group-hover:bg-primary group-hover:text-white group-hover:scale-emphasis">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4" dangerouslySetInnerHTML={{ __html: icon }} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground-muted mb-0.5">{label}</p>
                <p className="text-foreground text-sm font-medium truncate">{value}</p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="block transition-transform duration-base hover:translate-x-1"
            >
                {content}
            </a>
        );
    }

    return content;
}

interface SocialLinkProps {
    href: string;
    icon: string;
    label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group w-9 h-9 rounded-full bg-primary/15 dark:bg-background-secondary border border-primary/30 dark:border-foreground/10 flex items-center justify-center text-primary dark:text-foreground-muted transition-all duration-base hover:bg-primary hover:border-primary hover:text-white hover:scale-emphasis hover:shadow-lg hover:shadow-primary/25"
        >
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
            <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4" dangerouslySetInnerHTML={{ __html: icon }} />
        </a>
    );
}

// Phone icon SVG (solid/filled version)
const phoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" /></svg>`;

// Location icon SVG (solid/filled version)
const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" /></svg>`;

export function ContactInfo({ email, phone, location, social, translations, ariaLabels }: ContactInfoProps) {
    return (
        <div className="space-y-6">
            {/* Title & Description */}
            <div className="stagger-item">
                <h3 className="text-xl font-bold text-foreground mb-2">{translations.title}</h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">{translations.description}</p>
                {translations.sectionDescription && (
                    <p
                        className="text-foreground-secondary text-sm leading-relaxed mt-3"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - content comes from i18n translations, not user input
                        dangerouslySetInnerHTML={{ __html: translations.sectionDescription }}
                    />
                )}
            </div>

            {/* Contact Details */}
            <div className="space-y-4 stagger-item">
                <InfoItem icon={mailIcon} label={translations.emailLabel} value={email} href={`mailto:${email}`} />
                <InfoItem
                    icon={phoneIcon}
                    label={translations.phoneLabel}
                    value={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                />
                <InfoItem icon={locationIcon} label={translations.locationLabel} value={location} />
            </div>

            {/* Social Links */}
            <div className="stagger-item pt-2">
                <p className="text-xs text-foreground-muted mb-3">{translations.orConnect}</p>
                <div className="flex gap-2">
                    <SocialLink href={social.linkedin} icon={linkedinIcon} label={ariaLabels.linkedin} />
                    <SocialLink href={social.github} icon={githubIcon} label={ariaLabels.github} />
                    <SocialLink href={social.whatsapp} icon={whatsappIcon} label={ariaLabels.whatsapp} />
                    <SocialLink href={social.mail} icon={mailIcon} label={ariaLabels.mail} />
                </div>
            </div>
        </div>
    );
}
