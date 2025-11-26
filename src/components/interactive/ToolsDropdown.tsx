import { NavDropdown, type NavDropdownItem } from './NavDropdown';

interface ToolsDropdownProps {
    currentLocale: string;
    currentPath: string;
    allToolsLabel: string;
    tools: Array<{
        slug: string;
        title: string;
        icon?: string;
        category: string;
    }>;
    translations?: {
        headerTitle?: string;
        headerDescription?: string;
        viewAllLabel?: string;
    };
}

/**
 * Tools-specific dropdown wrapper
 * Uses the generic NavDropdown component with tools configuration
 */
export function ToolsDropdown({ currentLocale, currentPath, allToolsLabel, tools, translations }: ToolsDropdownProps) {
    // Build dropdown items (without "All Tools" - it goes in viewAllLink)
    const dropdownItems: NavDropdownItem[] = tools.map((tool) => ({
        id: tool.slug,
        label: tool.title,
        icon: tool.icon || '⚙️',
        href: `/${currentLocale}/goodies/${tool.slug}`
    }));

    // Check if we're on any tools page
    const isToolsActive = currentPath.includes('/goodies');

    return (
        <NavDropdown
            label={allToolsLabel}
            items={dropdownItems}
            isActive={isToolsActive}
            variant="grid"
            header={
                translations?.headerTitle || translations?.headerDescription
                    ? {
                          title: translations.headerTitle,
                          description: translations.headerDescription
                      }
                    : undefined
            }
            viewAllLink={
                translations?.viewAllLabel
                    ? {
                          label: translations.viewAllLabel,
                          href: `/${currentLocale}/goodies`
                      }
                    : undefined
            }
        />
    );
}
