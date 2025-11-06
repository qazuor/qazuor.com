import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { ProjectCard } from './ProjectCard';

interface Project {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  demoUrl?: string;
  codeUrl?: string;
  featured?: boolean;
}

interface ProjectsProps {
  projects?: Project[];
  translations?: {
    title: string;
    subtitle: string;
    noProjects: string;
    filterAll: string;
  };
  cardTranslations?: {
    demo: string;
    code: string;
    featured: string;
  };
}

export function Projects({
  projects = [],
  translations = {
    title: 'Featured Projects',
    subtitle: "A collection of projects I've built and contributed to",
    noProjects: 'No projects found with the selected filter.',
    filterAll: 'All',
  },
  cardTranslations = {
    demo: 'Demo',
    code: 'Code',
    featured: 'Featured',
  },
}: ProjectsProps) {
  const projectsRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState<string>(translations.filterAll);
  const hasAnimated = useRef(false);

  // Extract all unique tags
  const allTags =
    projects.length > 0
      ? [translations.filterAll, ...Array.from(new Set(projects.flatMap((p) => p.tags)))]
      : [translations.filterAll];

  // Filter projects by selected tag
  const filteredProjects =
    selectedTag === translations.filterAll
      ? projects
      : projects.filter((p) => p.tags.includes(selectedTag));

  useEffect(() => {
    if (!projectsRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // Animate section title
    const title = projectsRef.current.querySelector('.section-title');
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

    // Animate filter buttons
    const filters = projectsRef.current.querySelectorAll('.filter-button');
    gsap.from(filters, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: filters[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  // Animate project cards when they appear or when filter changes
  useEffect(() => {
    if (!projectsRef.current) return;

    const cards = projectsRef.current.querySelectorAll('.project-card');
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
      },
    );
  }, []);

  return (
    <section className="section">
      <div className="container-custom" ref={projectsRef}>
        {/* Section Title */}
        <div className="section-title mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">{translations.title}</span>
          </h2>
          <p className="text-foreground-secondary text-lg">{translations.subtitle}</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`filter-button px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedTag === tag
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'bg-foreground/5 text-foreground-secondary hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              {...project}
              translations={cardTranslations}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-secondary text-lg">{translations.noProjects}</p>
          </div>
        )}
      </div>
    </section>
  );
}
