import { getEffectiveSlug } from './getEffectiveSlug';
import type { BlogPost, SeriesData, SeriesPost } from './types';

/**
 * Get all posts from the same series as the current post.
 *
 * @param currentPost - The post to find series siblings for
 * @param allPosts - All blog posts from the collection
 * @returns SeriesData object with all posts in the series, or null if not part of a series
 */
export function getSeriesPosts(currentPost: BlogPost, allPosts: BlogPost[]): SeriesData | null {
    const currentSeries = currentPost.data.series;

    // Not part of a series
    if (!currentSeries) {
        return null;
    }

    // Find all posts in the same series
    const seriesPosts: SeriesPost[] = allPosts
        .filter((post) => {
            // Must have series data
            if (!post.data.series) return false;

            // Must be same series
            if (post.data.series.id !== currentSeries.id) return false;

            // Exclude drafts
            if (post.data.draft) return false;

            return true;
        })
        .map((post) => ({
            slug: getEffectiveSlug(post),
            title: post.data.title,
            part: post.data.series?.part ?? 0,
            isCurrent: getEffectiveSlug(post) === getEffectiveSlug(currentPost)
        }))
        .sort((a, b) => a.part - b.part);

    // No other posts in series (shouldn't happen, but handle it)
    if (seriesPosts.length === 0) {
        return null;
    }

    return {
        id: currentSeries.id,
        name: currentSeries.name,
        posts: seriesPosts,
        currentPart: currentSeries.part,
        totalParts: seriesPosts.length
    };
}

/**
 * Check if a post is part of a series.
 */
export function isPartOfSeries(post: BlogPost): boolean {
    return !!post.data.series;
}

/**
 * Get the next post in the series (if any).
 */
export function getNextInSeries(currentPost: BlogPost, allPosts: BlogPost[]): BlogPost | null {
    const series = currentPost.data.series;
    if (!series) return null;

    const nextPart = series.part + 1;

    return (
        allPosts.find(
            (post) => post.data.series?.id === series.id && post.data.series?.part === nextPart && !post.data.draft
        ) || null
    );
}

/**
 * Get the previous post in the series (if any).
 */
export function getPrevInSeries(currentPost: BlogPost, allPosts: BlogPost[]): BlogPost | null {
    const series = currentPost.data.series;
    if (!series || series.part <= 1) return null;

    const prevPart = series.part - 1;

    return (
        allPosts.find(
            (post) => post.data.series?.id === series.id && post.data.series?.part === prevPart && !post.data.draft
        ) || null
    );
}
