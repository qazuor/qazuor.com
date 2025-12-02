/**
 * JSON-LD Schema.org Type Definitions
 * Used for structured data across the website
 */

/**
 * Base JSON-LD type with required @context and @type
 */
export interface JsonLdBase {
    '@context': 'https://schema.org';
    '@type': string;
}

/**
 * Person Schema - For the site owner/author
 * @see https://schema.org/Person
 */
export interface PersonSchema extends JsonLdBase {
    '@type': 'Person';
    name: string;
    url?: string;
    image?: string;
    email?: string;
    jobTitle?: string;
    description?: string;
    sameAs?: string[];
    knowsAbout?: string[];
    worksFor?: OrganizationSchema;
}

/**
 * Organization Schema
 * @see https://schema.org/Organization
 */
export interface OrganizationSchema extends JsonLdBase {
    '@type': 'Organization';
    name: string;
    url?: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
}

/**
 * WebSite Schema - For the main site
 * @see https://schema.org/WebSite
 */
export interface WebSiteSchema extends JsonLdBase {
    '@type': 'WebSite';
    name: string;
    url: string;
    description?: string;
    author?: PersonSchema | { '@type': 'Person'; name: string };
    inLanguage?: string | string[];
    potentialAction?: SearchActionSchema;
}

/**
 * SearchAction for site search functionality
 * @see https://schema.org/SearchAction
 */
export interface SearchActionSchema {
    '@type': 'SearchAction';
    target: {
        '@type': 'EntryPoint';
        urlTemplate: string;
    };
    'query-input': string;
}

/**
 * WebPage Schema
 * @see https://schema.org/WebPage
 */
export interface WebPageSchema extends JsonLdBase {
    '@type': 'WebPage';
    name: string;
    url: string;
    description?: string;
    inLanguage?: string;
    isPartOf?: { '@type': 'WebSite'; name: string; url: string };
    breadcrumb?: BreadcrumbListSchema;
}

/**
 * BreadcrumbList Schema
 * @see https://schema.org/BreadcrumbList
 */
export interface BreadcrumbListSchema extends JsonLdBase {
    '@type': 'BreadcrumbList';
    itemListElement: BreadcrumbItemSchema[];
}

/**
 * Individual breadcrumb item
 */
export interface BreadcrumbItemSchema {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
}

/**
 * Service Schema - For service offerings
 * @see https://schema.org/Service
 */
export interface ServiceSchema extends JsonLdBase {
    '@type': 'Service';
    name: string;
    description?: string;
    provider?: PersonSchema | OrganizationSchema | { '@type': 'Person'; name: string };
    serviceType?: string;
    areaServed?: string | string[];
    url?: string;
    offers?: OfferSchema;
}

/**
 * Offer Schema - For pricing information
 * @see https://schema.org/Offer
 */
export interface OfferSchema {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    priceRange?: string;
    availability?: string;
}

/**
 * FAQPage Schema
 * @see https://schema.org/FAQPage
 */
export interface FAQPageSchema extends JsonLdBase {
    '@type': 'FAQPage';
    mainEntity: QuestionSchema[];
}

/**
 * Question Schema for FAQ
 * @see https://schema.org/Question
 */
export interface QuestionSchema {
    '@type': 'Question';
    name: string;
    acceptedAnswer: AnswerSchema;
}

/**
 * Answer Schema for FAQ
 * @see https://schema.org/Answer
 */
export interface AnswerSchema {
    '@type': 'Answer';
    text: string;
}

/**
 * BlogPosting Schema
 * @see https://schema.org/BlogPosting
 */
export interface BlogPostingSchema extends JsonLdBase {
    '@type': 'BlogPosting';
    headline: string;
    description?: string;
    datePublished: string;
    dateModified?: string;
    author: PersonSchema | { '@type': 'Person'; name: string };
    publisher?: OrganizationSchema | PersonSchema | { '@type': 'Person'; name: string };
    image?: string | string[];
    url?: string;
    mainEntityOfPage?: string;
    keywords?: string[];
    articleSection?: string;
    wordCount?: number;
    inLanguage?: string;
}

/**
 * Article Schema - More generic than BlogPosting
 * @see https://schema.org/Article
 */
export interface ArticleSchema extends JsonLdBase {
    '@type': 'Article';
    headline: string;
    description?: string;
    datePublished: string;
    dateModified?: string;
    author: PersonSchema | { '@type': 'Person'; name: string };
    publisher?: OrganizationSchema | PersonSchema;
    image?: string | string[];
    url?: string;
    mainEntityOfPage?: string;
}

/**
 * CreativeWork Schema - For projects/portfolio items
 * @see https://schema.org/CreativeWork
 */
export interface CreativeWorkSchema extends JsonLdBase {
    '@type': 'CreativeWork' | 'SoftwareApplication' | 'WebApplication';
    name: string;
    description?: string;
    url?: string;
    image?: string | string[];
    dateCreated?: string;
    datePublished?: string;
    author?: PersonSchema | { '@type': 'Person'; name: string };
    keywords?: string[];
    about?: string;
    applicationCategory?: string;
    operatingSystem?: string;
}

/**
 * ItemList Schema - For list pages
 * @see https://schema.org/ItemList
 */
export interface ItemListSchema extends JsonLdBase {
    '@type': 'ItemList';
    name?: string;
    description?: string;
    numberOfItems: number;
    itemListElement: ItemListElementSchema[];
}

/**
 * Individual item in a list
 */
export interface ItemListElementSchema {
    '@type': 'ListItem';
    position: number;
    url?: string;
    name?: string;
    item?: {
        '@type': string;
        name: string;
        url?: string;
        description?: string;
        image?: string;
    };
}

/**
 * HowTo Schema - For process/workflow documentation
 * @see https://schema.org/HowTo
 */
export interface HowToSchema extends JsonLdBase {
    '@type': 'HowTo';
    name: string;
    description?: string;
    step: HowToStepSchema[];
    totalTime?: string;
}

/**
 * HowTo Step
 */
export interface HowToStepSchema {
    '@type': 'HowToStep';
    position: number;
    name: string;
    text?: string;
    url?: string;
}

/**
 * Union type for all supported JSON-LD schemas
 */
export type JsonLdSchema =
    | PersonSchema
    | OrganizationSchema
    | WebSiteSchema
    | WebPageSchema
    | BreadcrumbListSchema
    | ServiceSchema
    | FAQPageSchema
    | BlogPostingSchema
    | ArticleSchema
    | CreativeWorkSchema
    | ItemListSchema
    | HowToSchema;

/**
 * Props for the JsonLd component
 */
export interface JsonLdProps {
    schema: JsonLdSchema | JsonLdSchema[];
}

/**
 * Props for BreadcrumbJsonLd component
 */
export interface BreadcrumbJsonLdProps {
    items: Array<{
        name: string;
        url?: string;
    }>;
}

/**
 * FAQ item for FAQJsonLd component
 */
export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Props for FAQJsonLd component
 */
export interface FAQJsonLdProps {
    items: FAQItem[];
}
