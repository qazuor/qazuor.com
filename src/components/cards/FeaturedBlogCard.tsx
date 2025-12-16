import { ArrowUpRight, Sparkles } from 'lucide-react';
import { memo } from 'react';
import './FeaturedBlogCard.css';

export interface OptimizedBlogImage {
    src: string;
    width: number;
    height: number;
}

export interface FeaturedBlogCardProps {
    title: string;
    excerpt: string;
    category: string;
    image: OptimizedBlogImage;
    slug: string;
    tags: string[];
    readTime: string;
    date: string;
    categoryColor: string;
    featuredLabel?: string;
    lang?: string;
}

export const FeaturedBlogCard = memo(function FeaturedBlogCard({
    title,
    excerpt,
    category,
    image,
    slug,
    tags,
    readTime,
    date,
    categoryColor,
    featuredLabel = 'Featured',
    lang = 'en'
}: FeaturedBlogCardProps) {
    // Format date for display based on language
    const dateLocale = lang === 'es' ? 'es-ES' : 'en-US';
    const formattedDate = new Date(date).toLocaleDateString(dateLocale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <article className="featured-blog-card">
            <a href={slug} className="featured-blog-card__link" aria-label={`Read ${title}`}>
                {/* Image Section */}
                <div className="featured-blog-card__image-container">
                    <img
                        src={image.src}
                        alt=""
                        width={image.width}
                        height={image.height}
                        decoding="async"
                        className="featured-blog-card__image"
                        loading="eager"
                    />
                    <div className="featured-blog-card__image-overlay" />
                </div>

                {/* Content Section */}
                <div className="featured-blog-card__content">
                    {/* Featured Badge & Meta */}
                    <div className="featured-blog-card__meta">
                        <span className="featured-blog-card__featured-badge">
                            <Sparkles size={12} className="featured-blog-card__badge-icon" />
                            {featuredLabel}
                        </span>
                        <span className="featured-blog-card__category" style={{ color: categoryColor }}>
                            {category}
                        </span>
                        <span className="featured-blog-card__separator">·</span>
                        <span className="featured-blog-card__date">{formattedDate}</span>
                    </div>

                    {/* Title */}
                    <h3 className="featured-blog-card__title">{title}</h3>

                    {/* Excerpt - content is sanitized markdown from content collections */}
                    <p className="featured-blog-card__excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />

                    {/* Footer: Tags & Read Time */}
                    <div className="featured-blog-card__footer">
                        <div className="featured-blog-card__tags">
                            {tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="featured-blog-card__tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="featured-blog-card__read-info">
                            <span className="featured-blog-card__read-time">{readTime}</span>
                            <span className="featured-blog-card__arrow">
                                <ArrowUpRight size={20} />
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
});
