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
  icon: string; // Emoji icon for the timeline
  category: 'education' | 'work' | 'project' | 'achievement' | 'skill';
  color: string; // Color for the active state
}

export const timelineData: TimelineItem[] = [
  {
    id: 'introduction',
    year: '✨',
    title: {
      en: 'My Journey',
      es: 'Mi Trayectoria',
    },
    description: {
      en: 'A journey through my professional evolution and most important milestones',
      es: 'Un viaje a través de mi evolución profesional y los hitos más importantes',
    },
    icon: 'sparkles',
    category: 'achievement',
    color: '#6366f1', // indigo
  },
  {
    id: 'birth',
    year: '1980',
    title: {
      en: 'The Beginning',
      es: 'Comienzo',
    },
    description: {
      en: 'Born with curiosity for technology already wired in. 👶',
      es: 'Nací y, sin saberlo, ya traía la curiosidad por la tecnología 💻 en el ADN.',
    },
    icon: 'user-circle',
    category: 'achievement',
    color: '#f59e0b', // amber
  },
  {
    id: 'msx2',
    year: '1987',
    title: {
      en: 'First Steps',
      es: 'Primer acercamiento',
    },
    description: {
      en: 'My first contact with computing: a Talent MSX2 Turbo 🖥️ where I started coding in BASIC.',
      es: 'Mi primer acercamiento a la informática con una Talent MSX2 Turbo 🖥️. Empecé a programar en BASIC.',
    },
    icon: 'computer-desktop',
    category: 'education',
    color: '#3b82f6', // blue
  },
  {
    id: 'first-pc',
    year: '1993',
    title: {
      en: 'First PC',
      es: 'Primer PC',
    },
    description: {
      en: 'A 386 running DOS and Windows 3.1 - wrote small programs in QBasic 💾.',
      es: 'Una 386 con DOS y Windows 3.1. Programé mis primeros experimentos en QBasic 💾.',
    },
    icon: 'device-desktop',
    category: 'education',
    color: '#10b981', // emerald
  },
  {
    id: 'automation',
    year: '1996',
    title: {
      en: 'Automation Project',
      es: 'Automatización',
    },
    description: {
      en: "Built a full irrigation automation system 💧 in QBasic as a computing class project for the school's annual technical exhibition.",
      es: 'Proyecto de riego automatizado 💧 hecho íntegramente en QBasic como trabajo para la muestra anual de la escuela técnica.',
    },
    icon: 'cog',
    category: 'project',
    color: '#8b5cf6', // violet
  },
  {
    id: 'graduation',
    year: '1998',
    title: {
      en: 'Graduation',
      es: 'Egresado',
    },
    description: {
      en: 'Finished technical school, already decided to live surrounded by code. 🎓',
      es: 'Termino la escuela técnica 🎓, ya decidido a vivir entre cables y código.',
    },
    icon: 'academic-cap',
    category: 'education',
    color: '#06b6d4', // cyan
  },
  {
    id: 'internet',
    year: '1999',
    title: {
      en: 'Internet Arrives',
      es: 'Internet',
    },
    description: {
      en: 'First dial-up connection - the modem sound 📞 still feels nostalgic.',
      es: 'Primer conexión dial-up. Aquello de escuchar el módem 📞 conectar era pura magia.',
    },
    icon: 'globe',
    category: 'skill',
    color: '#ef4444', // red
  },
  {
    id: 'html-family',
    year: '2000',
    title: {
      en: 'HTML & Family',
      es: 'HTML y familia',
    },
    description: {
      en: 'Discovered HTML, built my first client website 🌐 while studying graphic design at UNLP. My first son was born. 👶',
      es: 'Descubro el HTML, hago mi primera web 🌐 para un cliente mientras estudio diseño gráfico en la UNLP. Nace mi primer hijo. 👶',
    },
    icon: 'html5',
    category: 'skill',
    color: '#f59e0b', // amber
  },
  {
    id: 'visual-basic',
    year: '2000',
    title: {
      en: 'Visual Basic Era',
      es: 'Era Visual Basic',
    },
    description: {
      en: 'Discovered Visual Basic and developed several personal projects and client applications.',
      es: 'Conocí Visual Basic y realicé algunos desarrollos de proyectos míos y de clientes.',
    },
    icon: 'visual-basic',
    category: 'skill',
    color: '#8b5cf6', // violet
  },
  {
    id: 'backend-classic',
    year: '2001',
    title: {
      en: 'Backend World',
      es: 'Backend clásico',
    },
    description: {
      en: 'Entered backend development with ASP and Microsoft Access databases.',
      es: 'Entro al mundo del backend con ASP y bases de datos Access de Microsoft.',
    },
    icon: 'access',
    category: 'skill',
    color: '#3b82f6', // blue
  },
  {
    id: 'broadband',
    year: '2002',
    title: {
      en: 'Broadband',
      es: 'Banda ancha',
    },
    description: {
      en: 'First high-speed connection ⚡. The web felt infinite 🌐.',
      es: 'Primera conexión rápida ⚡. Se abre un universo nuevo de posibilidades 🌐.',
    },
    icon: 'bolt',
    category: 'skill',
    color: '#10b981', // emerald
  },
  {
    id: 'freelance-start',
    year: '2003',
    title: {
      en: 'Freelance Path',
      es: 'Freelance',
    },
    description: {
      en: 'Started working independently 💼 - first clients, first real challenges.',
      es: 'Comienzo formalmente mi camino freelance 💼. Primeros clientes, primeros desafíos reales.',
    },
    icon: 'briefcase',
    category: 'work',
    color: '#8b5cf6', // violet
  },
  {
    id: 'first-crm',
    year: '2004',
    title: {
      en: 'First CRM & Teaching',
      es: 'Primer CRM y docencia',
    },
    description: {
      en: 'Built a complete CRM in HTML, JS and PHP so my website clients could manage their own content. My daughter was born 👶 and I began teaching design and programming.',
      es: 'Desarrollo mi primer CRM completo en HTML, JS y PHP para que los clientes de mis sitios pudieran gestionar su propio contenido. Nace mi segunda hija 👶 y empiezo a dar clases de diseño y programación.',
    },
    icon: 'php',
    category: 'project',
    color: '#06b6d4', // cyan
  },
  {
    id: 'international',
    year: '2005',
    title: {
      en: 'International Client',
      es: 'Primer cliente internacional',
    },
    description: {
      en: 'Delivered a major freelance project for a Spanish software company. 🌍',
      es: 'Proyecto freelance grande para una empresa de software española. 🌍',
    },
    icon: 'paper-airplane',
    category: 'achievement',
    color: '#ef4444', // red
  },
  {
    id: 'avature-start',
    year: '2006',
    title: {
      en: 'Avature',
      es: 'Avature',
    },
    description: {
      en: 'Joined as Web Master, maintaining their website and a PHP-based ATS app.',
      es: 'Me sumo como Web Master, manteniendo su sitio y una ATS app desarrollada en PHP.',
    },
    icon: 'avature',
    category: 'work',
    color: '#f59e0b', // amber
  },
  {
    id: 'js-framework',
    year: '2008',
    title: {
      en: 'Custom JS Framework',
      es: 'Framework JS propio',
    },
    description: {
      en: "Part of a two-person team that built an enterprise JavaScript framework from scratch ⚙️ that's still in use today. It featured HMR, error handling and reporting, custom JS packaging, client-server communication, modular CSS and i18n.",
      es: 'En un equipo de dos personas, desarrollamos un framework JavaScript empresarial desde cero ⚙️ que aún se usa hoy. Incluía HMR, manejo y reporte de errores, sistema propio de empaquetado JS, comunicación cliente-servidor, CSS e i18n modularizado.',
    },
    icon: 'javascript',
    category: 'project',
    color: '#3b82f6', // blue
  },
  {
    id: 'frontend-focus',
    year: '2011',
    title: {
      en: 'Frontend Focus',
      es: 'Especialización Frontend',
    },
    description: {
      en: 'Specialized in frontend 🎨 and founded the UI-Core team at Avature.',
      es: 'Me especializo en desarrollo frontend 🎨 y formo el equipo UI-Core en Avature.',
    },
    icon: 'paint-brush',
    category: 'skill',
    color: '#10b981', // emerald
  },
  {
    id: 'tech-leadership',
    year: '2012',
    title: {
      en: 'Tech Leadership',
      es: 'Liderazgo técnico',
    },
    description: {
      en: 'As the team grew, I became the technical lead 👨‍💻 of UI-Core, defining standards and practices.',
      es: 'El equipo crece y quedo como líder técnico 👨‍💻 del equipo UI-Core, consolidando procesos y estilo de desarrollo.',
    },
    icon: 'user-group',
    category: 'achievement',
    color: '#8b5cf6', // violet
  },
  {
    id: 'new-challenges',
    year: '2017',
    title: {
      en: 'New Challenges',
      es: 'Nuevos retos',
    },
    description: {
      en: 'Created a solo team to prototype ⚡ new sub-apps and features before handing them off.',
      es: 'Formo un nuevo equipo para desarrollar features y sub-apps iniciales ⚡ antes de entregarlas a otros teams.',
    },
    icon: 'rocket',
    category: 'work',
    color: '#06b6d4', // cyan
  },
  {
    id: 'visual-builder',
    year: '2019',
    title: {
      en: 'Visual Builder',
      es: 'Visual Builder',
    },
    description: {
      en: "Led the development of Avature's visual template builder 🎯 system.",
      es: 'Lidero el desarrollo de un sistema visual 🎯 de creación de templates para Avature.',
    },
    icon: 'eye',
    category: 'project',
    color: '#ef4444', // red
  },
  {
    id: 'love-life',
    year: '2020',
    title: {
      en: 'Life Partner',
      es: 'Amor y vida',
    },
    description: {
      en: 'Met my current partner and adventure companion. 💕',
      es: 'Conozco a mi actual compañera de vida y aventuras. 💕',
    },
    icon: 'heart',
    category: 'achievement',
    color: '#f59e0b', // amber
  },
  {
    id: 'nocode-automation',
    year: '2023',
    title: {
      en: 'NO CODE Era',
      es: 'Era NO CODE',
    },
    description: {
      en: 'Discovered NO CODE tools 🤖 and created several personal automation projects.',
      es: 'Conocí herramientas NO CODE 🤖 y realicé algunos proyectos personales de automatización de cosas.',
    },
    icon: 'make',
    category: 'skill',
    color: '#14b8a6', // teal
  },
  {
    id: 'new-beginnings',
    year: '2025',
    title: {
      en: 'New Chapter',
      es: 'Nuevos comienzos',
    },
    description: {
      en: 'Closed my Avature chapter, relaunched myself as a freelance developer 🚀 and released my personal portfolio.',
      es: 'Cierro mi etapa en Avature, me relanzo como freelance 🚀 y lanzo mi portfolio personal.',
    },
    icon: 'star',
    category: 'achievement',
    color: '#3b82f6', // blue
  },
  {
    id: 'whats-next',
    year: '🚀',
    title: {
      en: "What's next?",
      es: '¿Qué sigue?',
    },
    description: {
      en: 'The journey continues ✨. Always looking for new challenges and opportunities to grow.',
      es: 'El viaje continúa ✨. Siempre buscando nuevos desafíos y oportunidades para crecer.',
    },
    icon: 'arrow-trending-up',
    category: 'achievement',
    color: '#10b981', // emerald
  },
];

export type { TimelineItem };
