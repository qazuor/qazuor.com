import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { BlogCard } from './BlogCard';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug?: string;
}

interface BlogProps {
  posts?: BlogPost[];
  showAll?: boolean;
  locale?: string;
  translations?: {
    title: string;
    subtitle: string;
    viewAll: string;
    noArticles: string;
    readMore: string;
  };
  cardTranslations?: {
    readMore: string;
  };
}

export function Blog({
  posts = [],
  showAll = false,
  locale = 'en',
  translations = {
    title: 'Latest Articles',
    subtitle: 'Thoughts, tutorials, and insights about web development',
    viewAll: 'View all articles',
    noArticles: 'No articles yet. Check back soon!',
    readMore: 'Read more',
  },
  cardTranslations = {
    readMore: 'Read more',
  },
}: BlogProps) {
  const blogRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const displayedPosts = showAll ? posts || [] : (posts || []).slice(0, 3);

  useEffect(() => {
    if (!blogRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // Animate section title
    const title = blogRef.current.querySelector('.section-title');
    if (title) {
      gsap.from(title, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate blog cards
    const cards = blogRef.current.querySelectorAll('.blog-card');
    gsap.from(cards, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <section className="section bg-background-secondary">
      <div className="container-custom" ref={blogRef}>
        {/* Section Title */}
        <div className="section-title mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">{translations.title}</span>
          </h2>
          <p className="text-foreground-secondary text-lg">{translations.subtitle}</p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedPosts.map((post, index) => (
            <BlogCard
              key={`${post.title}-${index}`}
              {...post}
              locale={locale}
              translations={cardTranslations}
            />
          ))}
        </div>

        {/* View All Button */}
        {!showAll && posts.length > 3 && (
          <div className="text-center">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors duration-300 font-medium shadow-glow-primary"
            >
              {translations.viewAll}
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Empty State */}
        {displayedPosts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-foreground-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="No articles"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-foreground-secondary text-lg">{translations.noArticles}</p>
          </div>
        )}
      </div>
    </section>
  );
}
