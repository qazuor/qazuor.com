/**
 * Blog Post Categories
 * Centralized category definitions with translations
 *
 * Usage:
 * - Blog posts use category keys (e.g., 'frontend', 'productivity')
 * - UI displays translated names based on current language
 * - Colors are mapped by category key in categoryColors.ts
 */

import type { SupportedLang } from '@/utils/blog/getBlogPostWithFallback';

/**
 * Category key type - all valid category identifiers
 */
export type BlogCategoryKey =
    | 'frontend'
    | 'productivity'
    | 'development'
    | 'architecture'
    | 'performance'
    | 'product'
    | 'business'
    | 'general';

/**
 * Category definition with translations
 */
export interface BlogCategory {
    key: BlogCategoryKey;
    translations: {
        es: string;
        en: string;
    };
}

/**
 * All blog categories with their translations
 */
export const blogCategories: BlogCategory[] = [
    {
        key: 'frontend',
        translations: {
            es: 'Frontend',
            en: 'Frontend'
        }
    },
    {
        key: 'productivity',
        translations: {
            es: 'Productividad',
            en: 'Productivity'
        }
    },
    {
        key: 'development',
        translations: {
            es: 'Desarrollo',
            en: 'Development'
        }
    },
    {
        key: 'architecture',
        translations: {
            es: 'Arquitectura',
            en: 'Architecture'
        }
    },
    {
        key: 'performance',
        translations: {
            es: 'Rendimiento',
            en: 'Performance'
        }
    },
    {
        key: 'product',
        translations: {
            es: 'Producto',
            en: 'Product'
        }
    },
    {
        key: 'business',
        translations: {
            es: 'Negocio',
            en: 'Business'
        }
    },
    {
        key: 'general',
        translations: {
            es: 'General',
            en: 'General'
        }
    }
];

/**
 * Map of category keys to category objects for quick lookup
 */
export const blogCategoriesMap: Record<BlogCategoryKey, BlogCategory> = blogCategories.reduce(
    (acc, category) => {
        acc[category.key] = category;
        return acc;
    },
    {} as Record<BlogCategoryKey, BlogCategory>
);

/**
 * Get all category keys
 */
export function getAllCategoryKeys(): BlogCategoryKey[] {
    return blogCategories.map((c) => c.key);
}

/**
 * Get translated category name
 */
export function getCategoryName(key: BlogCategoryKey, lang: SupportedLang): string {
    const category = blogCategoriesMap[key];
    return category?.translations[lang] ?? key;
}

/**
 * Get category by key
 */
export function getCategoryByKey(key: BlogCategoryKey): BlogCategory | undefined {
    return blogCategoriesMap[key];
}

/**
 * Get all categories with translations for a specific language
 * Useful for building filter dropdowns
 */
export function getCategoriesForLang(lang: SupportedLang): Array<{ key: BlogCategoryKey; name: string }> {
    return blogCategories.map((category) => ({
        key: category.key,
        name: category.translations[lang]
    }));
}

/**
 * Check if a string is a valid category key
 */
export function isValidCategoryKey(key: string): key is BlogCategoryKey {
    return getAllCategoryKeys().includes(key as BlogCategoryKey);
}
