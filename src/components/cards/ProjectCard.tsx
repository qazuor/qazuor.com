interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    image?: string;
    demoUrl?: string;
    codeUrl?: string;
    featured?: boolean;
    translations?: {
        demo: string;
        code: string;
        featured: string;
    };
}

export function ProjectCard({
    title,
    description,
    tags,
    image,
    demoUrl,
    codeUrl,
    featured = false,
    translations = {
        demo: 'Demo',
        code: 'Code',
        featured: 'Featured'
    }
}: ProjectCardProps) {
    return (
        <article className="project-card card-hover group overflow-hidden h-full flex flex-col">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {image ? (
                    <img
                        src={image}
                        alt={`${title} - ${description.substring(0, 80)}${description.length > 80 ? '...' : ''}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-primary/40 group-hover:scale-110 transition-transform duration-500">
                        {title[0]}
                    </div>
                )}
                {featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        {translations.featured}
                    </div>
                )}
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-foreground-secondary text-sm mb-4 flex-1">{description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-foreground/5 text-foreground-secondary rounded-full border border-foreground/10 hover:border-primary hover:text-primary transition-colors duration-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                {(demoUrl || codeUrl) && (
                    <div className="flex gap-3 pt-4 border-t border-foreground/10">
                        {demoUrl && (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors duration-300 text-sm font-medium"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                {translations.demo}
                            </a>
                        )}
                        {codeUrl && (
                            <a
                                href={codeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-foreground/20 text-foreground rounded-lg hover:border-primary hover:text-primary transition-colors duration-300 text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                {translations.code}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
