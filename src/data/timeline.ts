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
            en: 'A 386 running DOS and Windows 3.1 - wrote small programs in QBasic 💾.',
            es: 'Una 386 con DOS y Windows 3.1. Programé mis primeros experimentos en QBasic 💾.'
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
            en: 'Discovered HTML, built my first client website 🌐 while studying graphic design at UNLP. My first son was born. 👶',
            es: 'Descubro el HTML, hago mi primera web 🌐 para un cliente mientras estudio diseño gráfico en la UNLP. Nace mi primer hijo. 👶'
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
            en: 'Started working independently 💼 - first clients, first real challenges.',
            es: 'Comienzo formalmente mi camino freelance 💼. Primeros clientes, primeros desafíos reales.'
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
            en: 'Built a complete CRM in HTML, JS and PHP so my website clients could manage their own content. My daughter was born 👶 and I began teaching design and programming.',
            es: 'Desarrollo mi primer CRM completo en HTML, JS y PHP para que los clientes de mis sitios pudieran gestionar su propio contenido. Nace mi segunda hija 👶 y empiezo a dar clases de diseño y programación.'
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
            en: 'Joined as Web Master, maintaining their website and a PHP-based ATS app.',
            es: 'Me sumo como Web Master, manteniendo su sitio y una ATS app desarrollada en PHP.'
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
            en: "Part of a two-person team that built an enterprise JavaScript framework from scratch ⚙️ that's still in use today. It featured HMR, error handling and reporting, custom JS packaging, client-server communication, modular CSS and i18n.",
            es: 'En un equipo de dos personas, desarrollamos un framework JavaScript empresarial desde cero ⚙️ que aún se usa hoy. Incluía HMR, manejo y reporte de errores, sistema propio de empaquetado JS, comunicación cliente-servidor, CSS e i18n modularizado.'
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
            en: 'Specialized in frontend 🎨 and founded the UI-Core team at Avature.',
            es: 'Me especializo en desarrollo frontend 🎨 y formo el equipo UI-Core en Avature.'
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
            en: "Led the development of Avature's visual template builder 🎯 system.",
            es: 'Lidero el desarrollo de un sistema visual 🎯 de creación de templates para Avature.'
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
            en: 'Met my current partner and adventure companion. 💕',
            es: 'Conozco a mi actual compañera de vida y aventuras. 💕'
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
            en: 'Discovered NO CODE tools 🤖 and created several personal automation projects.',
            es: 'Conocí herramientas NO CODE 🤖 y realicé algunos proyectos personales de automatización de cosas.'
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
            en: 'Started integrating AI tools into my development workflow 🧠, boosting productivity and exploring new possibilities.',
            es: 'Comencé a integrar herramientas de IA en mi flujo de desarrollo 🧠, potenciando mi productividad y explorando nuevas posibilidades.'
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
            es: 'Cierro mi etapa en Avature, me relanzo como freelance 🚀 y lanzo mi portfolio personal.'
        },
        icon: 'flag',
        iconUseItemColor: true,
        category: 'achievement',
        colorLightTheme: '#2563eb',
        colorDarkTheme: '#60a5fa' // lighter variant for dark theme
    }
];

export type { TimelineItem };
