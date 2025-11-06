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
    id: 'frontend',
    skills: [
      { name: 'React', icon: 'react', color: '#61DAFB' },
      { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
      { name: 'Astro', icon: 'astro', color: '#FF5D01' },
      { name: 'Tailwind CSS', icon: 'tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 'backend',
    skills: [
      { name: 'Node.js', icon: 'nodejs', color: '#339933' },
      { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
    ],
  },
  {
    id: 'tools',
    skills: [
      { name: 'Git', icon: 'git', color: '#F05032' },
      { name: 'Figma', icon: 'figma', color: '#F24E1E' },
      { name: 'Docker', icon: 'docker', color: '#2496ED' },
    ],
  },
];
