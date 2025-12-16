import { ArrowUpRight } from 'lucide-react';
import { memo } from 'react';
import './SecondaryBlogCards.css';

export interface SecondaryBlogPost {
    title: string;
    excerpt: string;
    category: string;
    slug: string;
    tags: string[];
    readTime: string;
    date: string;
    borderColor: string;
}

export interface SecondaryBlogCardsProps {
    posts: SecondaryBlogPost[];
    lang?: string;
}

interface SecondaryCardProps {
    post: SecondaryBlogPost;
    index: number;
    lang: string;
}

const SecondaryCard = memo(function SecondaryCard({ post, index, lang }: SecondaryCardProps) {
    // Format date for display based on language
    const dateLocale = lang === 'es' ? 'es-ES' : 'en-US';
    const formattedDate = new Date(post.date).toLocaleDateString(dateLocale, {
        month: 'short',
        day: 'numeric'
    });

    return (
        <article
            className="secondary-card"
            style={
                {
                    '--card-border-color': post.borderColor,
                    '--card-index': index
                } as React.CSSProperties
            }
        >
            <a href={post.slug} className="secondary-card__link" aria-label={`Read ${post.title}`}>
                {/* Header: Category & Date */}
                <div className="secondary-card__header">
                    <span className="secondary-card__category">{post.category}</span>
                    <span className="secondary-card__date">{formattedDate}</span>
                </div>

                {/* Title */}
                <h3 className="secondary-card__title">{post.title}</h3>

                {/* Excerpt - only visible on expanded, content is sanitized markdown */}
                <p className="secondary-card__excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />

                {/* Footer: Tags & Read Time */}
                <div className="secondary-card__footer">
                    <div className="secondary-card__tags">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="secondary-card__tag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="secondary-card__read-info">
                        <span className="secondary-card__read-time">{post.readTime}</span>
                        <span className="secondary-card__arrow">
                            <ArrowUpRight size={18} />
                        </span>
                    </div>
                </div>
            </a>
        </article>
    );
});

export const SecondaryBlogCards = memo(function SecondaryBlogCards({ posts, lang = 'en' }: SecondaryBlogCardsProps) {
    if (posts.length === 0) return null;

    return (
        <div className="secondary-cards-container" data-card-count={posts.length}>
            {posts.map((post, index) => (
                <SecondaryCard key={post.slug} post={post} index={index} lang={lang} />
            ))}
        </div>
    );
});
