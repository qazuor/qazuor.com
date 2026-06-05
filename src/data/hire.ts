/**
 * Hire page data for SPEC-001.
 *
 * `HireProfile` is the single source of truth for the `/hire` recruiter landing
 * page. It is intentionally separated from the homepage composition so the
 * recruiter surface can be maintained independently and tuned for a sober,
 * scan-friendly editorial tone (per `design.md` §8).
 *
 * The page itself is bilingual via `HireTranslations`; the data block here
 * is a single bilingual payload keyed by `en` / `es`. The Astro page
 * (`src/pages/[lang]/hire/index.astro`) selects the active locale at build
 * time and renders from that subset.
 */

/**
 * Allowed locales for the hire data set. Mirrors `Locale` in `@/i18n/ui` but
 * is duplicated here to keep this data module free of UI runtime imports.
 */
export type HireLocale = 'en' | 'es';

/**
 * A single resume download link. `locale` indicates which version of the
 * resume the file is in. Use `'both'` when a single PDF serves both locales
 * (e.g., an English resume with a Spanish language note, or a side-by-side
 * bilingual document).
 */
export interface HireResumeLink {
    /** Display label, e.g. "Download resume (English)". */
    readonly label: string;
    /** Absolute or root-relative URL to the PDF. */
    readonly href: string;
    /** Which locale the resume content is authored in. */
    readonly locale: HireLocale | 'both';
}

/**
 * A professional link (LinkedIn, GitHub, Read.cv, etc.).
 */
export interface HireProfessionalLink {
    /** Display label, e.g. "LinkedIn". */
    readonly label: string;
    /** Absolute URL. */
    readonly href: string;
}

/**
 * A single key strength entry: short title + 1-2 line description.
 */
export interface HireKeyStrength {
    /** Short headline. */
    readonly title: string;
    /** 1-2 line supporting description. */
    readonly description: string;
}

/**
 * Bilingual payload for a single hire-page field. Each locale's content is
 * authored independently; the hire page is NOT a single source string with
 * i18n keys (the rest of the site uses `common.json` for that). The hire
 * surface is a structured document with its own translation contract.
 */
export interface HireTranslations {
    /** Page hero headline (the bio lives on `/about`). */
    readonly headline: string;
    /** Short availability line, e.g. "Open to conversations · Q3 2026 onward". */
    readonly availability: string;
    /** 3-5 short role-target labels. */
    readonly roleTargets: readonly string[];
    /** 2-3 paragraphs of experience summary. Each entry is one paragraph. */
    readonly experienceSummary: readonly string[];
    /** 4-6 key strengths, each with title + description. */
    readonly keyStrengths: readonly HireKeyStrength[];
    /** Section heading for the experience block. */
    readonly experienceHeading: string;
    /** Section heading for the key strengths block. */
    readonly strengthsHeading: string;
    /** Section heading for the selected work block. */
    readonly selectedWorkHeading: string;
    /** Section heading for the resume download block. */
    readonly resumeHeading: string;
    /** Section heading for the professional links block. */
    readonly professionalLinksHeading: string;
    /** Section heading for the contact preference block. */
    readonly contactPreferenceHeading: string;
    /** Short label for the contact CTA. */
    readonly contactCtaLabel: string;
}

/**
 * Full HireProfile data object: the union of locale-specific content and
 * locale-agnostic linkage (project slugs, contact info, resume files).
 */
export interface HireProfile {
    /** Translations for the English locale. */
    readonly en: HireTranslations;
    /** Translations for the Spanish locale. */
    readonly es: HireTranslations;
    /**
     * Project slugs (from `src/content/projects/`) chosen for the recruiter
     * selected-work surface. These MUST come from the `projects` collection
     * (NOT the `work` collection) — recruiters want technical depth, not
     * marketing framing. Slugs are matched after stripping the `-en`/`-es`
     * suffix.
     */
    readonly selectedProjectSlugs: readonly string[];
    /** Resume downloads in all available languages. */
    readonly resumeLinks: readonly HireResumeLink[];
    /** Professional links (LinkedIn, GitHub, etc.). */
    readonly professionalLinks: readonly HireProfessionalLink[];
    /** Contact preference line, e.g. "Email preferred · response within 48h". */
    readonly contactPreference: string;
    /** Working location and time zone. */
    readonly location: string;
    /** Time zone label, e.g. "GMT-3 (Argentina)". */
    readonly timeZone: string;
}

/**
 * The HireProfile data block. Edit here, not in the page.
 */
export const hireProfile: HireProfile = {
    en: {
        headline: 'Senior full-stack engineer open to senior IC, tech lead, and fractional staff roles',
        availability: 'Open to conversations · Q3 2026 onward',
        roleTargets: ['Senior IC', 'Tech lead', 'Fractional staff engineer', 'Architecture advisory'],
        experienceSummary: [
            'Twenty years of professional engineering, ten of them in production web work. I have spent most of my career as the senior person in the room — the one teams bring in when scope is fuzzy, the stack is shaky, or the design keeps stalling in review.',
            'My work sits at the intersection of frontend depth and full-stack pragmatism. I have shipped consumer apps, B2B dashboards, marketing sites, internal tools, and product surfaces. I am comfortable owning a feature end-to-end, leading a small pod, or stepping in as a fractional staff engineer to steady a codebase while the team scales.',
            'I have worked as a contracted senior, an embedded fractional, and a direct hire. I am remote-first (Argentina, GMT-3), async-friendly, and used to overlapping with US and EU teams. I do not run an agency; every line of code shipped under the Qazuor name is mine.'
        ],
        keyStrengths: [
            {
                title: 'Frontend depth, full-stack range',
                description:
                    'TypeScript, React, Astro, Tailwind, modern build tooling — paired with Node, Postgres, and pragmatic API design. Comfortable across the stack, strongest at the seam where UX meets engineering.'
            },
            {
                title: 'Scope and trade-off clarity',
                description:
                    'I write the proposal before I write the code. Fixed-scope or time-boxed engagements, transparent pricing, no surprise change-orders. I am the person teams call when scope has gone fuzzy.'
            },
            {
                title: 'Performance and accessibility as defaults',
                description:
                    'Lighthouse 90+ is the floor, not the ceiling. Semantic HTML, real keyboard flows, measured Core Web Vitals, and the boring infrastructure that keeps performance stable in production.'
            },
            {
                title: 'Code that ships and stays shipped',
                description:
                    'Type-safe, tested where it matters, documented where it hurts. Hand-offs are real, not theatrical — the next engineer (or my future self) can read it without a translator.'
            },
            {
                title: 'Bilingual delivery',
                description:
                    'Native Spanish, professional English, written-first communicator. I keep decisions, scope changes, and status updates where the team can actually find them.'
            },
            {
                title: 'Senior-only engagement',
                description:
                    "You talk to the person doing the work. No account managers, no junior handoffs, no 'let me check with the team' loops. Direct, fast, and accountable."
            }
        ],
        experienceHeading: 'Experience',
        strengthsHeading: 'Core strengths',
        selectedWorkHeading: 'Selected work (deeper than the marketing)',
        resumeHeading: 'Resume / CV',
        professionalLinksHeading: 'Professional links',
        contactPreferenceHeading: 'How to reach me',
        contactCtaLabel: 'Start a conversation'
    },
    es: {
        headline: 'Ingeniero full-stack senior abierto a roles senior IC, tech lead y staff fraccional',
        availability: 'Abierto a conversaciones · desde Q3 2026',
        roleTargets: ['Senior IC', 'Tech lead', 'Staff engineer fraccional', 'Asesoría de arquitectura'],
        experienceSummary: [
            'Veinte años de ingeniería profesional, diez de ellos en producto web en producción. Pasé la mayor parte de mi carrera siendo el senior en la sala — al que los equipos llaman cuando el alcance está difuso, el stack tambalea o el diseño se traba en review.',
            'Mi trabajo vive en la intersección entre profundidad frontend y pragmatismo full-stack. Entregué apps de consumo, dashboards B2B, sitios de marketing, herramientas internas y superficies de producto. Me siento cómodo owning una feature end-to-end, liderando un pod chico o entrando como staff fraccional para estabilizar un codebase mientras el equipo escala.',
            'Trabajé como senior contratado, embebido fraccional y hired directo. Soy remote-first (Argentina, GMT-3), async-friendly, y acostumbrado a superponerme con equipos de US y EU. No llevo una agencia: cada línea de código que sale bajo el nombre Qazuor es mía.'
        ],
        keyStrengths: [
            {
                title: 'Profundidad frontend, rango full-stack',
                description:
                    'TypeScript, React, Astro, Tailwind, tooling moderno de build — combinado con Node, Postgres y diseño pragmático de APIs. Cómodo en todo el stack, más fuerte en la costura donde UX se encuentra con ingeniería.'
            },
            {
                title: 'Claridad de alcance y trade-offs',
                description:
                    'Escribo la propuesta antes de escribir el código. Engagements de alcance fijo o time-boxed, precios transparentes, sin change-orders sorpresa. Soy la persona a la que llaman cuando el alcance se difuminó.'
            },
            {
                title: 'Performance y accesibilidad por default',
                description:
                    'Lighthouse 90+ es el piso, no el techo. HTML semántico, flujos reales de teclado, Core Web Vitals medidos y la infraestructura aburrida que mantiene la performance estable en producción.'
            },
            {
                title: 'Código que se entrega y se mantiene entregado',
                description:
                    'Type-safe, testeado donde importa, documentado donde duele. Los hand-offs son reales, no teatrales — el próximo engineer (o mi yo del futuro) lo puede leer sin un traductor.'
            },
            {
                title: 'Entrega bilingüe',
                description:
                    'Español nativo, inglés profesional, comunicador written-first. Mantengo decisiones, cambios de alcance y updates de status donde el equipo realmente los puede encontrar.'
            },
            {
                title: 'Engagement solo senior',
                description:
                    'Hablas con la persona que hace el trabajo. Sin account managers, sin handoffs a juniors, sin loops de "déjame consultar con el equipo". Directo, rápido y accountable.'
            }
        ],
        experienceHeading: 'Experiencia',
        strengthsHeading: 'Fortalezas centrales',
        selectedWorkHeading: 'Trabajo seleccionado (más profundo que el marketing)',
        resumeHeading: 'CV / Resume',
        professionalLinksHeading: 'Links profesionales',
        contactPreferenceHeading: 'Cómo contactarme',
        contactCtaLabel: 'Iniciar una conversación'
    },
    // Project slugs from src/content/projects/. Recruiters want depth, not the
    // curated case-study framing in /work. These are the projects that
    // demonstrate technical range.
    selectedProjectSlugs: ['markview', 'claude-code-config', 'qazuor-portfolio', 'cheroga-automation', 'bookmind'],
    resumeLinks: [
        {
            label: 'Download resume (English)',
            href: '/files/resume-leandro-asrilevich-en.pdf',
            locale: 'en'
        },
        {
            label: 'Descargar CV (Español)',
            href: '/files/cv-leandro-asrilevich-es.pdf',
            locale: 'es'
        }
    ],
    professionalLinks: [
        { label: 'LinkedIn', href: 'https://linkedin.com/in/qazuor' },
        { label: 'GitHub', href: 'https://github.com/qazuor' },
        { label: 'Read.cv', href: 'https://read.cv/qazuor' }
    ],
    contactPreference: 'Email preferred · response within 48 hours, Monday to Friday',
    location: 'Concepción del Uruguay, Entre Ríos, Argentina',
    timeZone: 'GMT-3 (Argentina)'
};

/**
 * Get the hire translations for a specific locale.
 *
 * @param locale - Target locale.
 * @returns The localized hire translations block.
 */
export function getHireTranslations(locale: HireLocale): HireTranslations {
    return hireProfile[locale];
}
