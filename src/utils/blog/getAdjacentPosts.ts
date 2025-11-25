import type { AdjacentPosts, BlogPost, PostSummary } from './types';

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

/**
 * Get chronologically adjacent posts (previous and next).
 *
 * Posts are sorted by publishDate descending (newest first).
 * - "Previous" = older post (published before current)
 * - "Next" = newer post (published after current)
 *
 * @param currentPost - The post to find adjacent posts for
 * @param allPosts - All blog posts from the collection
 * @returns Object with prev and next posts (null if at boundary)
 */
export function getAdjacentPosts(currentPost: BlogPost, allPosts: BlogPost[]): AdjacentPosts {
    // Filter out drafts and sort by date (newest first)
    const publishedPosts = allPosts
        .filter((post) => !post.data.draft)
        .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

    // Find current post index
    const currentIndex = publishedPosts.findIndex((post) => post.slug === currentPost.slug);

    // Post not found (shouldn't happen, but handle it)
    if (currentIndex === -1) {
        return { prev: null, next: null };
    }

    // Previous = older = next index (since sorted newest first)
    // Next = newer = previous index
    const prevPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;

    return {
        prev: prevPost ? toPostSummary(prevPost) : null,
        next: nextPost ? toPostSummary(nextPost) : null
    };
}
