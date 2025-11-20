export interface ActiveFiltersProps {
    selectedTechnologies: string[];
    onRemove: (tech: string) => void;
    onClearAll: () => void;
    translations: {
        activeFilters: string;
        clearAll: string;
    };
}

export function ActiveFilters({ selectedTechnologies, onRemove, onClearAll, translations }: ActiveFiltersProps) {
    if (selectedTechnologies.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-foreground/5 rounded-lg border border-foreground/10 min-h-[52px]">
            <span className="text-sm font-medium text-foreground-secondary">{translations.activeFilters}:</span>

            <div className="flex flex-wrap gap-2">
                {selectedTechnologies.map((tech) => (
                    <button
                        key={tech}
                        type="button"
                        onClick={() => onRemove(tech)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 group"
                    >
                        <span>{tech}</span>
                        <svg
                            className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
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
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={onClearAll}
                className="ml-auto text-sm text-foreground-secondary hover:text-foreground underline transition-colors"
            >
                {translations.clearAll}
            </button>
        </div>
    );
}
