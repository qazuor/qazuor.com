import { useEffect, useRef, useState } from 'react';

export interface TechnologyFilterProps {
    technologies: string[];
    selectedTechnologies: string[];
    onFilterChange: (technologies: string[]) => void;
    translations: {
        filterButton: string;
        searchPlaceholder: string;
        selectAll: string;
        clearAll: string;
        noResults: string;
    };
}

export function TechnologyFilter({
    technologies,
    selectedTechnologies,
    onFilterChange,
    translations
}: TechnologyFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxHeight, setMaxHeight] = useState<number>(600);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Filter technologies based on search
    const filteredTechnologies = technologies.filter((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()));

    // Check if mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Calculate max height when dropdown opens
    useEffect(() => {
        if (isOpen && buttonRef.current && !isMobile) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const bottomMargin = 16; // 16px margin from bottom
            const spaceBelow = viewportHeight - buttonRect.bottom - bottomMargin - 8; // 8px top margin + 16px bottom margin
            const calculatedMaxHeight = Math.min(600, spaceBelow);
            setMaxHeight(Math.max(200, calculatedMaxHeight)); // Minimum 200px
        }
    }, [isOpen, isMobile]);

    // Close dropdown when clicking outside and handle scroll
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);

            // Handle wheel event to prevent body scroll when scrolling the list
            const listElement = listRef.current;
            if (listElement) {
                const handleWheel = (e: WheelEvent) => {
                    const { scrollTop, scrollHeight, clientHeight } = listElement;
                    const isScrollingDown = e.deltaY > 0;
                    const isScrollingUp = e.deltaY < 0;

                    // Prevent body scroll if we're scrolling within bounds
                    if (
                        (isScrollingDown && scrollTop + clientHeight < scrollHeight) ||
                        (isScrollingUp && scrollTop > 0)
                    ) {
                        e.stopPropagation();
                    }
                };
                listElement.addEventListener('wheel', handleWheel);

                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                    listElement.removeEventListener('wheel', handleWheel);
                };
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleTechToggle = (tech: string) => {
        const newSelected = selectedTechnologies.includes(tech)
            ? selectedTechnologies.filter((t) => t !== tech)
            : [...selectedTechnologies, tech];

        onFilterChange(newSelected);
    };

    const handleSelectAll = () => {
        onFilterChange(technologies);
    };

    const handleClearAll = () => {
        onFilterChange([]);
    };

    const activeCount = selectedTechnologies.length;

    return (
        <div className="relative w-full md:w-auto">
            {/* Filter Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Filter icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                <span>{translations.filterButton}</span>

                {activeCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {activeCount}
                    </span>
                )}

                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Dropdown arrow"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown/Bottom Sheet */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    {isMobile && (
                        <button
                            type="button"
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsOpen(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setIsOpen(false);
                                }
                            }}
                            aria-label="Close filter"
                        />
                    )}

                    <div
                        ref={dropdownRef}
                        className={`
							${isMobile ? 'fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl' : 'absolute right-0 mt-2 z-50 rounded-lg'}
							bg-background border border-foreground/10 shadow-2xl
							${isMobile ? 'max-h-[80vh]' : 'w-96'}
							flex flex-col
							animate-in slide-in-from-bottom-4 duration-300
						`}
                        style={!isMobile ? { maxHeight: `${maxHeight}px` } : undefined}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-foreground/10">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-foreground">{translations.filterButton}</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-foreground-secondary hover:text-foreground p-1"
                                    aria-label="Close"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        role="img"
                                        aria-label="Close icon"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={translations.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-label="Search icon"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="flex-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                                >
                                    {translations.selectAll}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    className="flex-1 px-3 py-1.5 text-sm bg-foreground/5 text-foreground-secondary rounded-md hover:bg-foreground/10 transition-colors"
                                >
                                    {translations.clearAll}
                                </button>
                            </div>
                        </div>

                        {/* Technologies List */}
                        <div ref={listRef} className="flex-1 overflow-y-auto p-4">
                            {filteredTechnologies.length === 0 ? (
                                <p className="text-center text-foreground-secondary py-8">{translations.noResults}</p>
                            ) : (
                                <div className="space-y-1">
                                    {filteredTechnologies.map((tech) => {
                                        const isSelected = selectedTechnologies.includes(tech);
                                        return (
                                            <button
                                                key={tech}
                                                type="button"
                                                onClick={() => handleTechToggle(tech)}
                                                className={`
													w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
													${
                                                        isSelected
                                                            ? 'bg-primary/10 text-primary border border-primary/30'
                                                            : 'bg-foreground/5 text-foreground hover:bg-foreground/10 border border-transparent'
                                                    }
												`}
                                            >
                                                <div
                                                    className={`
													w-5 h-5 rounded border-2 flex items-center justify-center transition-all
													${isSelected ? 'bg-primary border-primary' : 'border-foreground/30'}
												`}
                                                >
                                                    {isSelected && (
                                                        <svg
                                                            className="w-3 h-3 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            role="img"
                                                            aria-label="Selected"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={3}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="font-medium">{tech}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
