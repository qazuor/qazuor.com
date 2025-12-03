/**
 * Contact Form Interests Data
 * Centralized definitions for contact form interests and service mappings
 */

/**
 * Interest IDs that can be selected in the contact form
 * These IDs map to translation keys in contact.interests.*
 */
export const INTEREST_IDS = [
    'websiteDesign',
    'branding',
    'webDevelopment',
    'logoDesign',
    'appDevelopment',
    'automation',
    'seoOptimization',
    'performanceOptimization',
    'remote',
    'fulltime',
    'contractor'
] as const;

export type InterestId = (typeof INTEREST_IDS)[number];

/**
 * Mapping from service IDs to their related interest IDs
 * Used to pre-select interests when navigating from a service page to contact
 */
export const SERVICE_TO_INTERESTS: Record<string, InterestId[]> = {
    'web-apps': ['webDevelopment', 'appDevelopment'],
    'landing-pages': ['websiteDesign', 'webDevelopment'],
    'automation-integration': ['automation'],
    'social-media-design': ['branding', 'logoDesign'],
    'web-optimization': ['seoOptimization', 'performanceOptimization']
};

/**
 * Helper function to get interests for a service
 * @param serviceId - The service ID
 * @returns Comma-separated string of interest IDs or empty string
 */
export function getInterestsForService(serviceId: string): string {
    return SERVICE_TO_INTERESTS[serviceId]?.join(',') || '';
}

/**
 * Validate if a string is a valid interest ID
 * @param interest - The string to validate
 * @returns True if valid interest ID
 */
export function isValidInterest(interest: string): interest is InterestId {
    return INTEREST_IDS.includes(interest as InterestId);
}
