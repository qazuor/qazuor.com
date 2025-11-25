import type { BlogPost, PostSummary } from './types';

interface ScoredPost {
    post: BlogPost;
    score: number;
}

/**
 * Calculate relevance score between two posts based on tags and category.
 * - Each shared tag: +2 points
 * - Same category: +3 points
 */
function calculateRelevanceScore(current: BlogPost, candidate: BlogPost): number {
    let score = 0;

    // Score for shared tags (2 points each)
    const currentTags = new Set(current.data.tags);
    for (const tag of candidate.data.tags) {
        if (currentTags.has(tag)) {
            score += 2;
        }
    }

    // Bonus for same category (3 points)
    if (current.data.category && current.data.category === candidate.data.category) {
        score += 3;
    }

    return score;
}

/**
 * Convert a BlogPost to a PostSummary for lighter data transfer.
 */
function toPostSummary(post: BlogPost): PostSummary {
    return {
        slug: post.slug,
        title: post.data.title,
        excerpt: post.data.excerpt,
        publishDate: post.data.publishDate,
        tags: post.data.tags,
        category: post.data.category,
        readTime: post.data.readTime,
        image: post.data.image
    };
}

export interface GetRelatedPostsOptions {
    /** Maximum number of related posts to return (default: 3) */
    limit?: number;
    /** Minimum relevance score required (default: 2) */
    minScore?: number;
    /** Exclude posts from the same series (default: true) */
    excludeSameSeries?: boolean;
}

/**
 * Get related posts for a given post based on shared tags and category.
 *
 * Algorithm:
 * 1. Filter out the current post and drafts
 * 2. Optionally exclude posts from the same series
 * 3. Calculate relevance score for each candidate
 * 4. Sort by score (desc), then by date (desc) for ties
 * 5. Return top N posts that meet minimum score
 *
 * @param currentPost - The post to find related posts for
 * @param allPosts - All blog posts from the collection
 * @param options - Configuration options
 * @returns Array of related posts (max 3 by default)
 */
export function getRelatedPosts(
    currentPost: BlogPost,
    allPosts: BlogPost[],
    options: GetRelatedPostsOptions = {}
): PostSummary[] {
    const { limit = 3, minScore = 2, excludeSameSeries = true } = options;

    const currentSeriesId = currentPost.data.series?.id;

    // Filter and score candidates
    const scoredPosts: ScoredPost[] = allPosts
        .filter((post) => {
            // Exclude current post
            if (post.slug === currentPost.slug) return false;

            // Exclude drafts
            if (post.data.draft) return false;

            // Optionally exclude posts from the same series
            if (excludeSameSeries && currentSeriesId && post.data.series?.id === currentSeriesId) {
                return false;
            }

            return true;
        })
        .map((post) => ({
            post,
            score: calculateRelevanceScore(currentPost, post)
        }))
        .filter((scored) => scored.score >= minScore);

    // Sort by score (desc), then by date (desc) for ties
    scoredPosts.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.post.data.publishDate.getTime() - a.post.data.publishDate.getTime();
    });

    // Take top N and convert to summaries
    return scoredPosts.slice(0, limit).map((scored) => toPostSummary(scored.post));
}
