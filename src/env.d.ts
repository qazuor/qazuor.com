/// <reference types="astro/client" />
/// <reference types="astro-i18next/client" />
/// <reference path="./types/auto-animate.d.ts" />

import type { SearchableItem } from './types/search';

declare global {
    interface ImportMetaEnv {
        readonly RESEND_API_KEY: string;
        readonly CONTACT_EMAIL: string;
        readonly RESEND_FROM_EMAIL: string;
    }

    interface Window {
        __SEARCH_INDEX__: SearchableItem[];
    }
}

declare module 'astro-i18next' {
    export interface AstroI18nextConfig {
        defaultLocale: string;
        locales: string[];
        routes?: Record<string, Record<string, string>>;
        i18nextServer?: unknown;
        i18nextClient?: unknown;
    }
    export function localizePath(path: string, locale?: string): string;
    export const t: (key: string) => string;
}
