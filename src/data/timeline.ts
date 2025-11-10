interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string; // Icon name or component identifier
  category: 'education' | 'work' | 'project' | 'achievement' | 'skill';
  color: string; // Color for the active state
}

export const timelineData: TimelineItem[] = [
  {
    id: 'start',
    year: '2018',
    title: 'Inicio en Programación',
    description: 'Comencé mi viaje en el desarrollo web aprendiendo HTML, CSS y JavaScript básico.',
    icon: 'code',
    category: 'education',
    color: '#3b82f6', // blue
  },
  {
    id: 'react',
    year: '2019',
    title: 'Descubriendo React',
    description:
      'Me sumergí en el ecosistema de React y comenzé a construir aplicaciones web modernas.',
    icon: 'react',
    category: 'skill',
    color: '#06b6d4', // cyan
  },
  {
    id: 'fullstack',
    year: '2020',
    title: 'Fullstack Developer',
    description: 'Expandí mis habilidades al backend con Node.js, Express y bases de datos.',
    icon: 'server',
    category: 'skill',
    color: '#10b981', // emerald
  },
  {
    id: 'first-job',
    year: '2021',
    title: 'Primer Trabajo',
    description:
      'Conseguí mi primera posición como desarrollador junior en una startup tecnológica.',
    icon: 'briefcase',
    category: 'work',
    color: '#8b5cf6', // violet
  },
  {
    id: 'typescript',
    year: '2022',
    title: 'Maestría en TypeScript',
    description: 'Adopté TypeScript completamente y mejoré la calidad de mis aplicaciones.',
    icon: 'typescript',
    category: 'skill',
    color: '#3b82f6', // blue
  },
  {
    id: 'senior',
    year: '2023',
    title: 'Senior Developer',
    description: 'Ascendí a desarrollador senior y comencé a liderar proyectos importantes.',
    icon: 'star',
    category: 'achievement',
    color: '#f59e0b', // amber
  },
  {
    id: 'freelance',
    year: '2024',
    title: 'Freelancer',
    description: 'Lancé mi carrera freelance creando soluciones personalizadas para clientes.',
    icon: 'rocket',
    category: 'work',
    color: '#ef4444', // red
  },
  {
    id: 'present',
    year: '2025',
    title: 'Presente',
    description:
      'Continúo creciendo, aprendiendo nuevas tecnologías y construyendo productos increíbles.',
    icon: 'present',
    category: 'achievement',
    color: '#06b6d4', // cyan
  },
];

// Translations
export const timelineTranslations = {
  en: {
    title: 'My Journey',
    subtitle: 'A timeline of my professional development',
    items: [
      {
        id: 'start',
        title: 'Getting Started',
        description: 'Started my web development journey learning HTML, CSS and basic JavaScript.',
      },
      {
        id: 'react',
        title: 'Discovering React',
        description: 'Dove into the React ecosystem and started building modern web applications.',
      },
      {
        id: 'fullstack',
        title: 'Fullstack Developer',
        description: 'Expanded my skills to backend with Node.js, Express and databases.',
      },
      {
        id: 'first-job',
        title: 'First Job',
        description: 'Got my first position as a junior developer at a tech startup.',
      },
      {
        id: 'typescript',
        title: 'TypeScript Mastery',
        description: 'Fully adopted TypeScript and improved the quality of my applications.',
      },
      {
        id: 'senior',
        title: 'Senior Developer',
        description: 'Promoted to senior developer and started leading important projects.',
      },
      {
        id: 'freelance',
        title: 'Freelancer',
        description: 'Launched my freelance career creating custom solutions for clients.',
      },
      {
        id: 'present',
        title: 'Present',
        description: 'Continue growing, learning new technologies and building amazing products.',
      },
    ],
  },
  es: {
    title: 'Mi Trayectoria',
    subtitle: 'Una línea de tiempo de mi desarrollo profesional',
    items: timelineData,
  },
};

export type { TimelineItem };
