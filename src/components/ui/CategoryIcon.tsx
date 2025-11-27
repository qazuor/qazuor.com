import {
    BookOpen,
    Code,
    ExternalLink,
    GraduationCap,
    Link,
    type LucideIcon,
    Package,
    Palette,
    Sparkles,
    Users,
    Wrench
} from 'lucide-react';

export type CategoryIconName =
    | 'tools'
    | 'snippets'
    | 'css-tricks'
    | 'useful-links'
    | 'documentation'
    | 'library'
    | 'tool'
    | 'learning'
    | 'inspiration'
    | 'community'
    | 'other';

const iconMap: Record<CategoryIconName, LucideIcon> = {
    tools: Wrench,
    snippets: Code,
    'css-tricks': Palette,
    'useful-links': Link,
    documentation: BookOpen,
    library: Package,
    tool: Wrench,
    learning: GraduationCap,
    inspiration: Sparkles,
    community: Users,
    other: ExternalLink
};

interface CategoryIconProps {
    name: CategoryIconName;
    className?: string;
    size?: number;
}

export function CategoryIcon({ name, className = '', size = 20 }: CategoryIconProps) {
    const IconComponent = iconMap[name] || ExternalLink;
    return <IconComponent className={className} size={size} />;
}
