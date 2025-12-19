import { useEffect, useMemo, useState } from 'react';

interface ProjectFiltersProps {
    categories: { value: string; label: string }[];
    technologies: string[];
    onFilterChange?: (filters: FilterState) => void;
    translations: {
        categoryLabel: string;
        technologyLabel: string;
        clearFilters: string;
    };
}

export interface FilterState {
    category: string;
    technologies: string[];
}

export function ProjectFilters({ categories, technologies, onFilterChange, translations }: ProjectFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

    // Memoize valid values for URL initialization
    const validCategoryValues = useMemo(() => new Set(categories.map((c) => c.value)), [categories]);
    const validTechnologies = useMemo(() => new Set(technologies), [technologies]);

    // Notify parent component when filters change
    useEffect(() => {
        const filters = {
            category: selectedCategory,
            technologies: selectedTechnologies
        };

        onFilterChange?.(filters);

        // Emit custom event for script tag to listen
        const event = new CustomEvent('filterChange', { detail: filters });
        window.dispatchEvent(event);
    }, [selectedCategory, selectedTechnologies, onFilterChange]);

    // Update URL query params when filters change (preserving other params like 'interests')
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        // Update category param
        if (selectedCategory !== 'all') {
            params.set('category', selectedCategory);
        } else {
            params.delete('category');
        }

        // Update tech param
        if (selectedTechnologies.length > 0) {
            params.set('tech', selectedTechnologies.join(','));
        } else {
            params.delete('tech');
        }

        const queryString = params.toString();
        const hash = window.location.hash;
        const newUrl = queryString
            ? `${window.location.pathname}?${queryString}${hash}`
            : `${window.location.pathname}${hash}`;
        window.history.replaceState({}, '', newUrl);
    }, [selectedCategory, selectedTechnologies]);

    // Initialize filters from URL on mount
    // Re-runs when valid values change (categories/technologies props)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('category');
        const techParam = params.get('tech');

        if (categoryParam && validCategoryValues.has(categoryParam)) {
            setSelectedCategory(categoryParam);
        }

        if (techParam) {
            const techs = techParam.split(',').filter((t) => validTechnologies.has(t));
            setSelectedTechnologies(techs);
        }
    }, [validCategoryValues, validTechnologies]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const handleTechnologyClick = (tech: string) => {
        setSelectedTechnologies((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
    };

    const handleClearFilters = () => {
        setSelectedCategory('all');
        setSelectedTechnologies([]);
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedTechnologies.length > 0;

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div>
                <h3 className="text-sm font-medium text-foreground-secondary mb-3">{translations.categoryLabel}</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            type="button"
                            onClick={() => handleCategoryClick(category.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                selectedCategory === category.value
                                    ? 'bg-primary text-white shadow-glow-primary'
                                    : 'bg-foreground/5 text-foreground-secondary hover:bg-foreground/10 hover:text-foreground'
                            }`}
                            aria-pressed={selectedCategory === category.value}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Technology Filter */}
            <div>
                <h3 className="text-sm font-medium text-foreground-secondary mb-3">{translations.technologyLabel}</h3>
                <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => {
                        const isSelected = selectedTechnologies.includes(tech);
                        return (
                            <button
                                key={tech}
                                type="button"
                                onClick={() => handleTechnologyClick(tech)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                                    isSelected
                                        ? 'bg-primary/20 text-primary border-2 border-primary'
                                        : 'bg-foreground/5 text-foreground-secondary hover:bg-foreground/10 hover:text-foreground border-2 border-transparent'
                                }`}
                                aria-pressed={isSelected}
                            >
                                {isSelected && (
                                    <span className="inline-block mr-1" aria-hidden="true">
                                        ✓
                                    </span>
                                )}
                                {tech}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-sm text-foreground-secondary hover:text-foreground underline transition-colors duration-200"
                    >
                        {translations.clearFilters}
                    </button>
                </div>
            )}
        </div>
    );
}
