/// <reference types="astro/client" />
/// <reference types="astro-i18next/client" />

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
