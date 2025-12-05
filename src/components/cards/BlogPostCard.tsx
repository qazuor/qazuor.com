import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './BlogPostCard.css';

export interface OptimizedBlogImage {
    src: string;
    width: number;
    height: number;
}

export interface BlogPostCardProps {
    title: string;
    excerpt: string;
    category: string;
    image: OptimizedBlogImage;
    slug: string;
    isActive?: boolean;
    onHover?: () => void;
    categoryColor?: string;
}

export function BlogPostCard({
    title,
    excerpt,
    category,
    image,
    slug,
    isActive = false,
    onHover,
    categoryColor = '#d3b19a'
}: BlogPostCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Intersection Observer for mobile auto-expansion
    useEffect(() => {
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                });
            },
            { threshold: 0.6 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [isMobile]);

    return (
        <article
            ref={cardRef}
            className="blog-post-card group"
            onMouseEnter={onHover}
            data-active={isMobile && (isActive || isVisible)}
        >
            {/* Full card clickable link */}
            <a href={slug} className="blog-post-card__link" aria-label={`Read ${title}`}>
                {/* Background Image */}
                <img
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    decoding="async"
                    className="blog-post-card__bg-image"
                    loading="lazy"
                />

                {/* Dark Overlay */}
                <div className="blog-post-card__overlay" />

                {/* Content */}
                <div className="blog-post-card__content">
                    {/* Category Badge */}
                    <div className="blog-post-card__category" style={{ backgroundColor: categoryColor }}>
                        {category}
                    </div>

                    {/* Title */}
                    <h3 className="blog-post-card__title">{title}</h3>

                    {/* Quote/Excerpt Wrapper (accordion) */}
                    <div className="blog-post-card__quote-wrapper">
                        <div className="blog-post-card__quote">
                            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: excerpt is pre-processed markdown from build-time content, not user input */}
                            <p dangerouslySetInnerHTML={{ __html: excerpt }} />
                        </div>
                    </div>
                </div>

                {/* Corner Icon with Inverted Rounded Border */}
                <div className="blog-post-card__icon-container">
                    <div className="blog-post-card__icon-circle" style={{ backgroundColor: categoryColor }}>
                        <span className="blog-post-card__icon">
                            <ArrowUpRight />
                        </span>
                    </div>
                </div>
            </a>
        </article>
    );
}
