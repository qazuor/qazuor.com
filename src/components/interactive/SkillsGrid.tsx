interface Skill {
  name: string;
  icon: string; // SVG content as string
  color: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface SkillsGridProps {
  categories: SkillCategory[];
}

const SkillsGrid = ({ categories }: SkillsGridProps) => {
  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category.title} className="skill-category">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
            {category.title}
          </h3>
          <div className="flex flex-wrap gap-3">
            {category.skills.map((skill) => (
              <div
                key={skill.name}
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 
                         rounded-full border border-primary/20 hover:border-primary/40 transition-all duration-300
                         cursor-pointer"
                title={skill.name}
              >
                {/* SVG Icon */}
                <div
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
                  style={{ color: skill.color }}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe static SVG icons from our controlled source
                  dangerouslySetInnerHTML={{ __html: skill.icon }}
                />

                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
                              bg-background-secondary border border-border rounded text-xs text-foreground-secondary
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                              whitespace-nowrap z-10"
                >
                  {skill.name}
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                                border-l-2 border-r-2 border-t-2 border-transparent border-t-background-secondary"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsGrid;
