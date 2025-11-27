import { useStaggerAnimation } from '@/hooks';
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
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
                className="block transition-transform duration-300 hover:translate-x-1"
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
            className="group w-9 h-9 rounded-full bg-background-secondary border border-foreground/10 flex items-center justify-center text-foreground-muted transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
        >
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
            <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4" dangerouslySetInnerHTML={{ __html: icon }} />
        </a>
    );
}

// Phone icon SVG
const phoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>`;

// Location icon SVG
const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>`;

export function ContactInfo({ email, phone, location, social, translations, ariaLabels }: ContactInfoProps) {
    const containerRef = useStaggerAnimation<HTMLDivElement>('.contact-info-item', {
        y: 20,
        duration: 0.6,
        stagger: 0.1
    });

    return (
        <div ref={containerRef} className="space-y-6">
            {/* Title & Description */}
            <div className="contact-info-item">
                <h3 className="text-xl font-bold text-foreground mb-2">{translations.title}</h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">{translations.description}</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 contact-info-item">
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
            <div className="contact-info-item pt-2">
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
