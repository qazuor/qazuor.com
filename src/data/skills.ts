/**
 * Skills Data
 * Tech stack and skills categorized by type
 */

export interface Skill {
    name: string;
    icon: string;
    color: string;
}

export interface SkillCategory {
    id: string;
    skills: Skill[];
}

export const skillsData: SkillCategory[] = [
    {
        id: 'dev',
        skills: [
            { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
            { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
            { name: 'Node.js', icon: 'nodejs', color: '#339933' },
            { name: 'Drizzle ORM', icon: 'drizzle', color: '#C5F74F' },
            { name: 'Git', icon: 'git', color: '#F05032' },
            { name: 'PostgreSQL', icon: 'postgresql', color: '#336791' },
            { name: 'React', icon: 'react', color: '#61DAFB' },
            { name: 'Astro', icon: 'astro', color: '#FF5D01' },
            { name: 'TanStack Start', icon: 'tanstack', color: '#FF6154' },
            { name: 'Tailwind CSS', icon: 'tailwind', color: '#06B6D4' },
            { name: 'CSS 3', icon: 'css3', color: '#1572B6' },
            { name: 'HTML 5', icon: 'html5', color: '#E34F26' },
            { name: 'Hono', icon: 'hono', color: '#E36002' },
            { name: 'REST API', icon: 'restapi', color: '#61DAFB' },
            { name: 'Zod', icon: 'zod', color: '#3E67B1' }
        ]
    },
    {
        id: 'languages',
        skills: [
            { name: 'English', icon: 'english', color: '#012169' },
            { name: 'Spanish', icon: 'spanish', color: '#AA151B' }
        ]
    },
    {
        id: 'design',
        skills: [
            { name: 'CorelDRAW', icon: 'coreldraw', color: '#019639' },
            { name: 'Adobe Photoshop', icon: 'photoshop', color: '#31A8FF' },
            { name: 'Canva', icon: 'canva', color: '#00C4CC' }
        ]
    },
    {
        id: 'tools',
        skills: [
            { name: 'Git', icon: 'git', color: '#F05032' },
            { name: 'GitHub', icon: 'github', color: '#181717' },
            { name: 'VS Code', icon: 'vscode', color: '#007ACC' },
            { name: 'Claude', icon: 'claude', color: '#D97706' }
        ]
    }
];
