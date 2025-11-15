// Command Palette Types
export interface CommandItem {
    id: string;
    value: string;
    href?: string;
    action?: string;
    icon: string;
    keywords?: string[];
    external?: boolean;
    label?: string;
}

export interface CommandGroup {
    heading: string;
    items: CommandItem[];
}

export interface KeyboardShortcut {
    type: 'navigation' | 'action';
    href?: string;
    action?: string;
    commandKey: boolean;
    external?: boolean;
}
