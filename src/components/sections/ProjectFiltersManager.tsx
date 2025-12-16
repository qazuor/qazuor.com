import autoAnimate from '@formkit/auto-animate';
import { useCallback, useEffect, useRef, useState } from 'react';
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

    // Store all cards permanently - preserve original DOM elements (useRef since it never triggers re-renders)
    const allCardsCache = useRef(new Map<string, Array<{ element: HTMLElement; technologies: string[] }>>()).current;

    // Read filters from URL and sync state
    const syncFiltersFromUrl = useCallback((techs: string[]) => {
        const params = new URLSearchParams(window.location.search);
        const tech = params.get('tech');
        if (tech) {
            setSelectedTechnologies(tech.split(',').filter((t) => techs.includes(t)));
        } else {
            setSelectedTechnologies([]);
        }
    }, []);

    // Initialize technologies and cards cache from DOM on mount
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

        // Cache all cards on first mount
        const sections = document.querySelectorAll('.category-section');
        sections.forEach((section) => {
            const category = (section as HTMLElement).getAttribute('data-category');
            if (!category) return;

            const cards = Array.from(section.querySelectorAll('.project-card')) as HTMLElement[];
            allCardsCache.set(
                category,
                cards.map((card) => ({
                    element: card, // Keep original element, don't clone
                    technologies: JSON.parse(card.getAttribute('data-technologies') || '[]')
                }))
            );
        });

        // Read initial filters from URL
        syncFiltersFromUrl(techs);

        setMounted(true);
    }, [allCardsCache, syncFiltersFromUrl]);

    // Listen for browser back/forward navigation (popstate)
    useEffect(() => {
        const handlePopState = () => {
            syncFiltersFromUrl(allTechnologies);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [allTechnologies, syncFiltersFromUrl]);

    const applyFilters = useCallback(
        (technologies: string[]) => {
            const categoriesContainer = document.getElementById('categories-container');
            if (!categoriesContainer) return;

            let totalVisible = 0;

            // Get all category sections
            const sections = document.querySelectorAll('.category-section');

            sections.forEach((section) => {
                const category = (section as HTMLElement).getAttribute('data-category');
                if (!category) return;

                const projectsGrid = section.querySelector('.projects-grid') as HTMLElement;
                if (!projectsGrid) return;

                const allCards = allCardsCache.get(category) || [];

                // Determine visible cards based on filter
                const visibleCards = allCards.filter(({ technologies: cardTechs }) => {
                    return technologies.length === 0 || technologies.every((tech) => cardTechs.includes(tech));
                });

                // Get currently visible cards in the grid
                const currentCards = Array.from(projectsGrid.children) as HTMLElement[];

                // Remove cards that should be hidden
                currentCards.forEach((card) => {
                    const shouldBeVisible = visibleCards.some(({ element }) => element === card);
                    if (!shouldBeVisible) {
                        projectsGrid.removeChild(card);
                    }
                });

                // Add cards that should be visible (preserve order)
                visibleCards.forEach(({ element }) => {
                    if (!projectsGrid.contains(element)) {
                        projectsGrid.appendChild(element);
                    }
                });

                const visibleInCategory = visibleCards.length;
                totalVisible += visibleInCategory;

                // Update category count
                const countElement = section.querySelector('.category-count');
                if (countElement) {
                    countElement.textContent = `(${visibleInCategory})`;
                }

                // Show/hide category section
                if (visibleInCategory > 0) {
                    (section as HTMLElement).style.display = '';
                } else {
                    (section as HTMLElement).style.display = 'none';
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
        },
        [allCardsCache]
    );

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
