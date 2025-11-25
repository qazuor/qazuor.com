import type { CollectionEntry } from 'astro:content';

/** Blog post from content collection */
export type BlogPost = CollectionEntry<'blog'>;

/** Series information extracted from a post */
export interface SeriesInfo {
    id: string;
    name: string;
    part: number;
}

/** A post within a series with its metadata */
export interface SeriesPost {
    slug: string;
    title: string;
    part: number;
    isCurrent: boolean;
}

/** Complete series data for display */
export interface SeriesData {
    id: string;
    name: string;
    posts: SeriesPost[];
    currentPart: number;
    totalParts: number;
}

/** Minimal post data for related/adjacent posts */
export interface PostSummary {
    slug: string;
    title: string;
    excerpt: string;
    publishDate: Date;
    tags: string[];
    category?: string;
    readTime: string;
    image?: ImageMetadata;
}

/** Adjacent posts (previous and next) */
export interface AdjacentPosts {
    prev: PostSummary | null;
    next: PostSummary | null;
}

/** Image metadata type from Astro */
interface ImageMetadata {
    src: string;
    width: number;
    height: number;
    format: string;
}
