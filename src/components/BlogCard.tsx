interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug?: string;
  translations?: {
    readMore: string;
  };
}

export function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  tags,
  slug = '#',
  translations = {
    readMore: 'Read more',
  },
}: BlogCardProps) {
  return (
    <article className="blog-card card-hover group p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 text-sm text-foreground-muted">
        <time dateTime={date} className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <span>•</span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {readTime}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
        <a href={slug} className="hover:underline">
          {title}
        </a>
      </h3>

      {/* Excerpt */}
      <p className="text-foreground-secondary text-sm mb-4 line-clamp-3">{excerpt}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-foreground/5 text-foreground-secondary rounded-full border border-foreground/10 hover:border-primary hover:text-primary transition-colors duration-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Read more link */}
      <a
        href={slug}
        className="inline-flex items-center text-primary hover:text-primary-600 font-medium transition-colors duration-300 group/link"
      >
        {translations.readMore}
        <svg
          className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  );
}
