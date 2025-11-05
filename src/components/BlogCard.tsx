import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  delay?: number;
}

/**
 * Animated blog card component
 */
export function BlogCard({ title, excerpt, date, readTime, tags, slug, delay = 0 }: BlogCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.from(cardRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      delay,
      ease: 'power2.out',
    });
  }, [delay]);

  return (
    <article
      ref={cardRef}
      className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
        <span>•</span>
        <span>{readTime}</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <a href={`/blog/${slug}`} className="hover:underline">
          {title}
        </a>
      </h3>

      {/* Excerpt */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{excerpt}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Read more link */}
      <a
        href={`/blog/${slug}`}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        Read more
        <svg
          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  );
}
