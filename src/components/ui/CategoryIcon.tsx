import {
    BookOpen,
    Bot,
    Boxes,
    Code,
    ExternalLink,
    Image,
    Link,
    type LucideIcon,
    Package,
    Palette,
    Sparkles,
    Wand2,
    Wrench,
    Youtube
} from 'lucide-react';

export type CategoryIconName =
    | 'tools'
    | 'snippets'
    | 'css-tricks'
    | 'useful-links'
    | 'ai'
    | 'docs'
    | 'react-components'
    | 'animations'
    | 'libraries'
    | 'icons'
    | 'illustrations'
    | 'inspiration'
    | 'youtube';

const iconMap: Record<CategoryIconName, LucideIcon> = {
    tools: Wrench,
    snippets: Code,
    'css-tricks': Palette,
    'useful-links': Link,
    ai: Bot,
    docs: BookOpen,
    'react-components': Boxes,
    animations: Wand2,
    libraries: Package,
    icons: Sparkles,
    illustrations: Image,
    inspiration: Palette,
    youtube: Youtube
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
