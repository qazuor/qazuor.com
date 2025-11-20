export interface ActiveFiltersProps {
    selectedTechnologies: string[];
    onRemove: (tech: string) => void;
    onClearAll: () => void;
    translations: {
        activeFilters: string;
        activeFiltersLabel: string;
        moreFilters: string;
        clearAll: string;
    };
}

export function ActiveFilters({ selectedTechnologies, onRemove, onClearAll, translations }: ActiveFiltersProps) {
    if (selectedTechnologies.length === 0) {
        return null;
    }

    // Show only first 3 filters on mobile, 7 on desktop
    const maxVisible = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 7;
    const visibleTechnologies = selectedTechnologies.slice(0, maxVisible);
    const hiddenCount = selectedTechnologies.length - maxVisible;

    return (
        <div className="flex items-center gap-3 px-3 md:px-6 bg-foreground/5 rounded-lg border border-foreground/10 h-[52px]">
            <span className="text-xs md:text-sm font-medium text-foreground-secondary whitespace-nowrap">
                {translations.activeFiltersLabel}
            </span>

            <div className="flex items-center gap-2 flex-1 overflow-hidden">
                {visibleTechnologies.map((tech) => {
                    return (
                        <button
                            key={tech}
                            type="button"
                            onClick={() => onRemove(tech)}
                            className="relative inline-flex items-center px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/30 transition-all duration-200 group whitespace-nowrap overflow-hidden"
                        >
                            <span className="group-hover:opacity-50 transition-opacity duration-200">{tech}</span>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary/90 rounded-full">
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-label="Remove filter"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </button>
                    );
                })}

                {hiddenCount > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 bg-foreground/10 text-foreground-secondary rounded-full text-xs font-medium whitespace-nowrap">
                        +{hiddenCount} {translations.moreFilters}
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={onClearAll}
                className="ml-auto text-foreground-secondary hover:text-foreground transition-colors p-1 flex-shrink-0"
                aria-label={translations.clearAll}
            >
                <span className="hidden md:inline text-sm underline">{translations.clearAll}</span>
                <svg
                    className="w-4 h-4 md:hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Clear all filters"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
