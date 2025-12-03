import { Gauge, type LucideIcon, Monitor, Palette, Rocket, Zap } from 'lucide-react';

export type ServiceIconName = 'web-apps' | 'landing-pages' | 'automation' | 'social-design' | 'web-optimization';

const iconMap: Record<ServiceIconName, LucideIcon> = {
    'web-apps': Monitor,
    'landing-pages': Rocket,
    automation: Zap,
    'social-design': Palette,
    'web-optimization': Gauge
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
