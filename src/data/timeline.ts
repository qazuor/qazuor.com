interface TimelineItem {
    id: string;
    year: string;
    title: {
        en: string;
        es: string;
    };
    description: {
        en: string;
        es: string;
    };
    icon: string; // Icon name for the timeline
    iconUseItemColor: boolean; // If true, icon uses item color; if false, uses its own colors
    category: 'education' | 'work' | 'project' | 'achievement' | 'skill';
    colorLightTheme: string; // Color for light theme
    colorDarkTheme: string; // Color for dark theme
}

export const timelineData: TimelineItem[] = [
    {
        id: 'first-pc',
        year: '1993',
        title: {
            en: 'First PC',
            es: 'Primer PC'
        },
        description: {
            en: 'A 386 running DOS and Windows 3.1 - wrote my first programs in QBasic 💾. The start of everything.',
            es: 'Una 386 con DOS y Windows 3.1. Programé mis primeros experimentos en QBasic 💾. El inicio de todo.'
        },
        icon: 'device-desktop',
        iconUseItemColor: true,
        category: 'education',
        colorLightTheme: '#059669',
        colorDarkTheme: '#34d399' // lighter variant for dark theme
    },
    {
        id: 'html-family',
        year: '2000',
        title: {
            en: 'HTML & Family',
            es: 'HTML y familia'
        },
        description: {
            en: 'Discovered HTML and built my first client website 🌐 while studying graphic design. My first son was born 👶.',
            es: 'Descubro HTML y creo mi primera web 🌐 para un cliente mientras estudio diseño gráfico. Nace mi primer hijo 👶.'
        },
        icon: 'globe',
        iconUseItemColor: true,
        category: 'skill',
        colorLightTheme: '#d97706',
        colorDarkTheme: '#fbbf24' // lighter variant for dark theme
    },
    {
        id: 'freelance-start',
        year: '2003',
        title: {
            en: 'Freelance Path',
            es: 'Freelance'
        },
        description: {
            en: 'Started working independently 💼 - first clients, first real challenges, and complete creative freedom.',
            es: 'Comienzo mi camino freelance 💼. Primeros clientes, primeros desafíos reales y libertad creativa total.'
        },
        icon: 'briefcase',
        iconUseItemColor: true,
        category: 'work',
        colorLightTheme: '#7c3aed',
        colorDarkTheme: '#a78bfa' // lighter variant for dark theme
    },
    {
        id: 'first-crm',
        year: '2004',
        title: {
            en: 'First CRM & Teaching',
            es: 'Primer CRM y docencia'
        },
        description: {
            en: 'Built a CRM in HTML, JS and PHP for client content management. My daughter was born 👶 and I started teaching.',
            es: 'Desarrollo un CRM en HTML, JS y PHP para gestión de contenido. Nace mi hija 👶 y empiezo a dar clases.'
        },
        icon: 'cog',
        iconUseItemColor: true,
        category: 'project',
        colorLightTheme: '#0891b2',
        colorDarkTheme: '#22d3ee' // lighter variant for dark theme
    },
    {
        id: 'avature-start',
        year: '2006',
        title: {
            en: 'Avature',
            es: 'Avature'
        },
        description: {
            en: 'Joined Avature as Web Master 🏢, maintaining their website and building features for a PHP-based ATS app.',
            es: 'Me sumo a Avature como Web Master 🏢, manteniendo su sitio y desarrollando features para una ATS app en PHP.'
        },
        icon: 'avature',
        iconUseItemColor: false,
        category: 'work',
        colorLightTheme: '#d97706',
        colorDarkTheme: '#fbbf24' // lighter variant for dark theme
    },
    {
        id: 'js-framework',
        year: '2008',
        title: {
            en: 'Custom JS Framework',
            es: 'Framework JS propio'
        },
        description: {
            en: 'Built an enterprise JS framework from scratch ⚙️ with HMR, error handling, custom packaging and i18n - still in use today.',
            es: 'Creamos un framework JS empresarial desde cero ⚙️ con HMR, manejo de errores, empaquetado propio e i18n - aún en uso.'
        },
        icon: 'javascript',
        iconUseItemColor: false,
        category: 'project',
        colorLightTheme: '#2563eb',
        colorDarkTheme: '#60a5fa' // lighter variant for dark theme
    },
    {
        id: 'frontend-focus',
        year: '2011',
        title: {
            en: 'Frontend Focus',
            es: 'Especialización Frontend'
        },
        description: {
            en: 'Specialized in frontend development 🎨 and founded the UI-Core team at Avature, focusing on user experience.',
            es: 'Me especializo en frontend 🎨 y fundo el equipo UI-Core en Avature, enfocado en experiencia de usuario.'
        },
        icon: 'paint-brush',
        iconUseItemColor: true,
        category: 'skill',
        colorLightTheme: '#059669',
        colorDarkTheme: '#34d399' // lighter variant for dark theme
    },
    {
        id: 'tech-leadership',
        year: '2012',
        title: {
            en: 'Tech Leadership',
            es: 'Liderazgo técnico'
        },
        description: {
            en: 'As the team grew, I became the technical lead 👨‍💻 of UI-Core, defining standards and practices.',
            es: 'El equipo crece y quedo como líder técnico 👨‍💻 del equipo UI-Core, consolidando procesos y estilo de desarrollo.'
        },
        icon: 'user-group',
        iconUseItemColor: true,
        category: 'achievement',
        colorLightTheme: '#7c3aed',
        colorDarkTheme: '#a78bfa' // lighter variant for dark theme
    },
    {
        id: 'visual-builder',
        year: '2019',
        title: {
            en: 'Visual Builder',
            es: 'Visual Builder'
        },
        description: {
            en: "Led development of Avature's visual template builder 🎯 - a drag-and-drop system for creating custom layouts.",
            es: 'Lidero el desarrollo del constructor visual de templates 🎯 - un sistema drag-and-drop para crear layouts.'
        },
        icon: 'squares',
        iconUseItemColor: true,
        category: 'project',
        colorLightTheme: '#d97706',
        colorDarkTheme: '#fbbf24' // amber - important milestone
    },
    {
        id: 'love-life',
        year: '2020',
        title: {
            en: 'Life Partner',
            es: 'Amor y vida'
        },
        description: {
            en: 'Met my life partner and adventure companion 💕. A new chapter begins, balancing love, family and code.',
            es: 'Conozco a mi compañera de vida y aventuras 💕. Un nuevo capítulo empieza, equilibrando amor, familia y código.'
        },
        icon: 'heart',
        iconUseItemColor: true,
        category: 'achievement',
        colorLightTheme: '#d97706',
        colorDarkTheme: '#fbbf24' // lighter variant for dark theme
    },
    {
        id: 'nocode-automation',
        year: '2022',
        title: {
            en: 'NO CODE Era',
            es: 'Era NO CODE'
        },
        description: {
            en: 'Discovered NO CODE tools 🤖 and built personal automation projects - a new way to solve problems fast.',
            es: 'Descubro herramientas NO CODE 🤖 y creo proyectos de automatización - una nueva forma de resolver problemas.'
        },
        icon: 'make',
        iconUseItemColor: false,
        category: 'skill',
        colorLightTheme: '#0891b2',
        colorDarkTheme: '#22d3ee' // cyan - technical skill
    },
    {
        id: 'ai-development',
        year: '2024',
        title: {
            en: 'AI-Powered Development',
            es: 'Desarrollo con IA'
        },
        description: {
            en: 'Integrated AI tools into my development workflow 🧠, boosting productivity and exploring new possibilities.',
            es: 'Integro herramientas de IA en mi flujo de desarrollo 🧠, potenciando productividad y explorando nuevas posibilidades.'
        },
        icon: 'brain',
        iconUseItemColor: true,
        category: 'skill',
        colorLightTheme: '#059669',
        colorDarkTheme: '#34d399' // emerald - growth/skill
    },
    {
        id: 'new-beginnings',
        year: '2025',
        title: {
            en: 'New Chapter',
            es: 'Nuevos comienzos'
        },
        description: {
            en: 'Closed my Avature chapter, relaunched myself as a freelance developer 🚀 and released my personal portfolio.',
            es: 'Cierro mi etapa en Avature, me relanzo como desarrollador freelance 🚀 y publico mi portfolio personal.'
        },
        icon: 'flag',
        iconUseItemColor: true,
        category: 'achievement',
        colorLightTheme: '#2563eb',
        colorDarkTheme: '#60a5fa' // lighter variant for dark theme
    }
];

export type { TimelineItem };
