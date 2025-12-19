import { Globe, type LucideIcon, Monitor, Palette, Rocket, TrendingUp, Zap } from 'lucide-react';

export type ServiceIconName =
    | 'web-apps'
    | 'landing-pages'
    | 'automation'
    | 'social-design'
    | 'web-optimization'
    | 'wordpress';

const iconMap: Record<ServiceIconName, LucideIcon> = {
    'web-apps': Monitor,
    'landing-pages': Rocket,
    automation: Zap,
    'social-design': Palette,
    'web-optimization': TrendingUp,
    wordpress: Globe
};

interface ServiceIconProps {
    name: ServiceIconName;
    className?: string;
    size?: number;
}

export function ServiceIcon({ name, className = '', size = 20 }: ServiceIconProps) {
    const IconComponent = iconMap[name] || Monitor;
    return <IconComponent className={className} size={size} />;
}
