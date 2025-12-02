/**
 * Skills Data
 * Tech stack and skills categorized by type for radar chart visualization
 */

export interface Skill {
    name: string; // i18n key for soft skills and other skills, direct name for dev hard skills
    icon: string; // icon filename (without path or extension)
    color: string; // hex color for radar chart
    value: number; // 0-100 for radar chart visualization
    description?: string; // Optional description key for i18n (for other skills)
}

export interface LanguageSkill {
    id: string;
    name: string;
    icon: string;
    value: number;
    noteKey: 'native' | 'writtenOnly' | 'fluent' | 'intermediate' | 'basic';
}

export interface SkillCategory {
    id: 'technicalSkills' | 'humanCreativeSkills';
    skills: Skill[];
}

export const skillsData: SkillCategory[] = [
    {
        id: 'technicalSkills',
        skills: [
            // Core Development Skills
            { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E', value: 100 },
            { name: 'TypeScript', icon: 'typescript', color: '#3178C6', value: 85 },
            { name: 'Node.js', icon: 'nodejs', color: '#339933', value: 75 },
            { name: 'React', icon: 'react', color: '#61DAFB', value: 80 },
            { name: 'Astro', icon: 'astro', color: '#FF5D01', value: 90 },
            { name: 'HTML 5', icon: 'html5', color: '#E34F26', value: 95 },
            { name: 'CSS 3', icon: 'css3', color: '#1572B6', value: 90 },
            { name: 'Tailwind CSS', icon: 'tailwind', color: '#06B6D4', value: 80 },
            { name: 'PostgreSQL', icon: 'postgresql', color: '#336791', value: 70 },
            { name: 'Drizzle ORM', icon: 'drizzle', color: '#C5F74F', value: 70 },
            { name: 'Hono', icon: 'hono', color: '#E36002', value: 70 },
            { name: 'Zod', icon: 'zod', color: '#3E67B1', value: 75 },
            { name: 'Git', icon: 'git', color: '#F05032', value: 85 },
            { name: 'Claude Code', icon: 'claudecode', color: '#D97706', value: 85 },
            // Technical Other Skills
            {
                name: 'webPerformance',
                icon: 'bolt',
                color: '#10B981',
                value: 85,
                description: 'webPerformanceDescription'
            },
            {
                name: 'webAccessibility',
                icon: 'check-circle',
                color: '#14B8A6',
                value: 70,
                description: 'webAccessibilityDescription'
            },
            {
                name: 'seo',
                icon: 'search',
                color: '#4285F4',
                value: 90,
                description: 'seoDescription'
            }
        ]
    },
    {
        id: 'humanCreativeSkills',
        skills: [
            // Top Soft Skills (High Value)
            { name: 'positiveAttitude', icon: 'sun', color: '#F59E0B', value: 100 },
            { name: 'teamwork', icon: 'user-group', color: '#EC4899', value: 100 },
            { name: 'curiosity', icon: 'search', color: '#84CC16', value: 90 },
            { name: 'creativity', icon: 'sparkles', color: '#F97316', value: 90 },
            { name: 'communication', icon: 'chat-bubble', color: '#3B82F6', value: 85 },
            { name: 'analyticalThinking', icon: 'lightbulb', color: '#EF4444', value: 90 },
            { name: 'decisionMaking', icon: 'check-circle', color: '#14B8A6', value: 80 },
            { name: 'problemSolving', icon: 'x-circle', color: '#6366F1', value: 75 },
            { name: 'adaptability', icon: 'arrow-right', color: '#06B6D4', value: 70 },
            { name: 'flexibility', icon: 'arrow-up', color: '#10B981', value: 80 },
            // Creative Skills
            {
                name: 'graphicDesign',
                icon: 'coreldraw',
                color: '#019639',
                value: 90,
                description: 'graphicDesignDescription'
            },
            {
                name: 'imageEditing',
                icon: 'photoshop',
                color: '#00C4CC',
                value: 70,
                description: 'imageEditingDescription'
            },
            {
                name: 'branding',
                icon: 'palette',
                color: '#31A8FF',
                value: 80,
                description: 'brandingDescription'
            },
            {
                name: 'socialMediaAndFlyers',
                icon: 'canva',
                color: '#31A8FF',
                value: 80,
                description: 'socialMediaAndFlyersDescription'
            },
            {
                name: 'automation',
                icon: 'make',
                color: '#6C4AB6',
                value: 70,
                description: 'automationDescription'
            }
        ]
    }
];

export const languageSkills: LanguageSkill[] = [
    {
        id: 'spanish',
        name: 'Spanish',
        icon: 'spanish',
        value: 100,
        noteKey: 'native'
    },
    {
        id: 'english',
        name: 'English',
        icon: 'usa',
        value: 55,
        noteKey: 'writtenOnly'
    }
];
