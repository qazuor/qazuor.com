import autoAnimate from '@formkit/auto-animate';
import { useCallback, useEffect, useState } from 'react';
import { ActiveFilters } from '@/components/ui/ActiveFilters';
import { TechnologyFilter } from '@/components/ui/TechnologyFilter';

interface ProjectFiltersManagerProps {
    filterTranslations: {
        filterButton: string;
        searchPlaceholder: string;
        selectAll: string;
        clearAll: string;
        activeFilters: string;
        activeFiltersLabel: string;
        moreFilters: string;
        clearFilters: string;
        noResults: string;
    };
}

export function ProjectFiltersManager({ filterTranslations }: ProjectFiltersManagerProps) {
    const [allTechnologies, setAllTechnologies] = useState<string[]>([]);
    const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    // Initialize technologies from DOM on mount
    useEffect(() => {
        const allProjects = document.querySelectorAll('.project-card');
        const techs = Array.from(
            new Set(
                Array.from(allProjects).flatMap((card) => {
                    const techsAttr = card.getAttribute('data-technologies');
                    return techsAttr ? JSON.parse(techsAttr) : [];
                })
            )
        ).sort() as string[];

        setAllTechnologies(techs);

        // Read initial filters from URL
        const params = new URLSearchParams(window.location.search);
        const tech = params.get('tech');
        if (tech) {
            setSelectedTechnologies(tech.split(',').filter((t) => techs.includes(t)));
        }

        setMounted(true);
    }, []);

    const applyFilters = useCallback((technologies: string[]) => {
        const categoriesContainer = document.getElementById('categories-container');
        if (!categoriesContainer) return;

        const allCategorySections = new Map<string, HTMLElement>();
        const allCardsByCategory = new Map<HTMLElement, HTMLElement[]>();

        // Get all category sections
        const sections = document.querySelectorAll('.category-section');
        sections.forEach((section) => {
            const category = (section as HTMLElement).getAttribute('data-category');
            if (category) {
                allCategorySections.set(category, section as HTMLElement);
            }
        });

        let totalVisible = 0;
        const visibleCategories = new Map<string, number>();

        allCategorySections.forEach((section, category) => {
            const projectsGrid = section.querySelector('.projects-grid') as HTMLElement;
            if (!projectsGrid) return;

            // Store all cards
            if (!allCardsByCategory.has(section)) {
                const cards = Array.from(section.querySelectorAll('.project-card')) as HTMLElement[];
                allCardsByCategory.set(section, cards);
            }

            const allCards = allCardsByCategory.get(section) || [];

            // Determine visible cards
            const visibleCards = allCards.filter((card) => {
                const cardTechs = JSON.parse(card.getAttribute('data-technologies') || '[]') as string[];
                return technologies.length === 0 || technologies.every((tech) => cardTechs.includes(tech));
            });

            // Get currently visible cards
            const currentCards = Array.from(projectsGrid.children) as HTMLElement[];

            // Remove cards that shouldn't be visible
            currentCards.forEach((card) => {
                if (!visibleCards.includes(card)) {
                    projectsGrid.removeChild(card);
                }
            });

            // Add cards that should be visible
            visibleCards.forEach((card) => {
                if (!projectsGrid.contains(card)) {
                    projectsGrid.appendChild(card);
                }
            });

            const visibleInCategory = visibleCards.length;
            totalVisible += visibleInCategory;

            // Update category count
            const countElement = section.querySelector('.category-count');
            if (countElement) {
                countElement.textContent = `(${visibleInCategory})`;
            }

            if (visibleInCategory > 0) {
                visibleCategories.set(category, visibleInCategory);
            }
        });

        // Update visible category sections
        const currentSections = Array.from(categoriesContainer.children) as HTMLElement[];

        currentSections.forEach((section) => {
            const category = section.getAttribute('data-category');
            if (category && !visibleCategories.has(category)) {
                categoriesContainer.removeChild(section);
            }
        });

        allCategorySections.forEach((section, category) => {
            if (visibleCategories.has(category) && !categoriesContainer.contains(section)) {
                categoriesContainer.appendChild(section);
            }
        });

        // Show/hide empty state
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            if (totalVisible === 0) {
                emptyState.classList.remove('hidden');
            } else {
                emptyState.classList.add('hidden');
            }
        }

        // Update URL
        const params = new URLSearchParams();
        if (technologies.length > 0) {
            params.set('tech', technologies.join(','));
        }
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }, []);

    // Apply filters whenever selection changes
    useEffect(() => {
        if (!mounted) return;

        applyFilters(selectedTechnologies);
    }, [selectedTechnologies, mounted, applyFilters]);

    // Setup AutoAnimate on mount
    useEffect(() => {
        if (!mounted) return;

        const categoriesContainer = document.getElementById('categories-container');
        if (categoriesContainer) {
            autoAnimate(categoriesContainer, {
                duration: 400,
                disrespectUserMotionPreference: true
            });
        }

        const projectGrids = document.querySelectorAll('.projects-grid');
        projectGrids.forEach((grid) => {
            autoAnimate(grid as HTMLElement, {
                duration: 400,
                disrespectUserMotionPreference: true
            });
        });
    }, [mounted]);

    const handleFilterChange = (techs: string[]) => {
        setSelectedTechnologies(techs);
    };

    const handleRemove = (tech: string) => {
        setSelectedTechnologies((prev) => prev.filter((t) => t !== tech));
    };

    const handleClearAll = () => {
        setSelectedTechnologies([]);
    };

    if (!mounted) {
        return null; // Don't render until we have the data from DOM
    }

    return (
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            {/* Filter Button (top on mobile, right on desktop) */}
            <div className="w-full md:w-auto md:order-2">
                <TechnologyFilter
                    technologies={allTechnologies}
                    selectedTechnologies={selectedTechnologies}
                    onFilterChange={handleFilterChange}
                    translations={filterTranslations}
                />
            </div>

            {/* Active Filters (bottom on mobile, left on desktop) */}
            <div className="w-full md:flex-1 md:min-w-0 md:order-1">
                <ActiveFilters
                    selectedTechnologies={selectedTechnologies}
                    onRemove={handleRemove}
                    onClearAll={handleClearAll}
                    translations={{
                        activeFilters: filterTranslations.activeFilters,
                        activeFiltersLabel: filterTranslations.activeFiltersLabel,
                        moreFilters: filterTranslations.moreFilters,
                        clearAll: filterTranslations.clearFilters
                    }}
                />
            </div>
        </div>
    );
}
