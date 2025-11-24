import commonEn from '@/locales/en/common.json';
import projectsEn from '@/locales/en/projects.json';
import servicesEn from '@/locales/en/services.json';
import skillsEn from '@/locales/en/skills.json';

import commonEs from '@/locales/es/common.json';
import projectsEs from '@/locales/es/projects.json';
import servicesEs from '@/locales/es/services.json';
import skillsEs from '@/locales/es/skills.json';

export const languages = {
    en: 'English',
    es: 'Español'
} as const;

export const defaultLang = 'en';

export const ui = {
    en: { ...commonEn, services: servicesEn, skills: skillsEn, projects: projectsEn },
    es: { ...commonEs, services: servicesEs, skills: skillsEs, projects: projectsEs }
} as const;

export type Locale = keyof typeof ui;
