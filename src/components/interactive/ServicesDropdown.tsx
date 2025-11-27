import { services } from '@/data/services';
import { ServiceIcon } from '../ui/ServiceIcon';
import { NavDropdown, type NavDropdownItem } from './NavDropdown';

interface ServicesDropdownProps {
    currentLocale: string;
    currentPath: string;
    allServicesLabel: string;
    translations: {
        webApps: string;
        landingPages: string;
        automation: string;
        socialDesign: string;
        headerTitle?: string;
        headerDescription?: string;
        viewAllLabel?: string;
    };
}

/**
 * Services-specific dropdown wrapper
 * Uses the generic NavDropdown component with services configuration
 */
export function ServicesDropdown({
    currentLocale,
    currentPath,
    allServicesLabel,
    translations
}: ServicesDropdownProps) {
    // Map service IDs to translations
    const serviceLabels: Record<string, string> = {
        'web-apps': translations.webApps,
        'landing-pages': translations.landingPages,
        'automation-integration': translations.automation,
        'social-media-design': translations.socialDesign
    };

    // Build dropdown items (without "All Services" - it goes in viewAllLink)
    const dropdownItems: NavDropdownItem[] = services.map((service) => ({
        id: service.id,
        label: serviceLabels[service.id],
        icon: <ServiceIcon name={service.iconId} size={18} />,
        href: `/${currentLocale}/services/${service.slug}`
    }));

    // Check if we're on any services page
    const isServicesActive = currentPath.includes('/services');

    return (
        <NavDropdown
            label={allServicesLabel}
            items={dropdownItems}
            isActive={isServicesActive}
            variant="grid"
            header={
                translations.headerTitle || translations.headerDescription
                    ? {
                          title: translations.headerTitle,
                          description: translations.headerDescription
                      }
                    : undefined
            }
            viewAllLink={
                translations.viewAllLabel
                    ? {
                          label: translations.viewAllLabel,
                          href: `/${currentLocale}/services`
                      }
                    : undefined
            }
        />
    );
}
