/**
 * Astro Integration: Section Background Interpolation Generator
 * Automatically generates CSS interpolations from src/data/sectionBackgrounds.ts
 */

import { existsSync, mkdirSync, readFileSync, unwatchFile, watchFile, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

interface ColorInterpolationOptions {
    sourceFile?: string;
    outputFile?: string;
    steps?: number;
    watch?: boolean;
}

interface SectionColors {
    hero: string;
    about: string;
    skills: string;
    projects: string;
    servicesPreview: string;
    blog: string;
    services: string;
    goodies: string;
    testimonials: string;
    contact: string;
    faqs: string;
    footer: string;
}

/**
 * Interpolates between two hex colors
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);

    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generates interpolation steps between two colors
 */
function generateInterpolationSteps(fromColor: string, toColor: string, steps: number): string[] {
    const interpolations: string[] = [];

    for (let i = 1; i <= steps; i++) {
        const factor = i / steps;
        interpolations.push(interpolateColor(fromColor, toColor, factor));
    }

    return interpolations;
}

/**
 * Generates CSS custom properties for all transitions
 */
function generateTransitionCSS(colors: SectionColors, steps: number): string {
    const transitions = [
        { name: 'hero-to-about', from: colors.hero, to: colors.about },
        { name: 'about-to-skills', from: colors.about, to: colors.skills },
        { name: 'skills-to-projects', from: colors.skills, to: colors.projects },
        { name: 'projects-to-services-preview', from: colors.projects, to: colors.servicesPreview },
        { name: 'services-preview-to-blog', from: colors.servicesPreview, to: colors.blog },
        { name: 'projects-to-blog', from: colors.projects, to: colors.blog },
        { name: 'blog-to-services', from: colors.blog, to: colors.services },
        { name: 'blog-to-testimonials', from: colors.blog, to: colors.testimonials },
        { name: 'services-to-testimonials', from: colors.services, to: colors.testimonials },
        { name: 'testimonials-to-faqs', from: colors.testimonials, to: colors.faqs },
        { name: 'testimonials-to-contact', from: colors.testimonials, to: colors.contact },
        { name: 'faqs-to-contact', from: colors.faqs, to: colors.contact },
        { name: 'contact-to-faqs', from: colors.contact, to: colors.faqs },
        { name: 'faqs-to-footer', from: colors.faqs, to: colors.footer },
        { name: 'contact-to-footer', from: colors.contact, to: colors.footer }
    ];

    let css = '';

    for (const transition of transitions) {
        const interpolations = generateInterpolationSteps(transition.from, transition.to, steps);
        // Use 2 spaces for indentation and lowercase hex colors
        css += `  /* ${transition.name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: ${transition.from} to ${transition.to} */\n`;

        interpolations.forEach((color, index) => {
            // Ensure hex colors are lowercase and use 2 spaces for indentation
            const lowercaseColor = color.toLowerCase();
            css += `  --${transition.name}-${index + 1}: ${lowercaseColor};\n`;
        });
        css += '\n';
    }

    return css;
}

/**
 * Loads colors from the source file using direct file reading
 */
function loadColorsFromSource(sourceFile: string): { dark: SectionColors; light: SectionColors } {
    try {
        const filePath = join(process.cwd(), sourceFile);
        const content = readFileSync(filePath, 'utf-8');

        // Extract colors using regex patterns (simple approach)
        const darkColorsMatch = content.match(/export const darkModeColors[\s\S]*?= \{([\s\S]*?)\}/);
        const lightColorsMatch = content.match(/export const lightModeColors[\s\S]*?= \{([\s\S]*?)\}/);

        if (!darkColorsMatch || !lightColorsMatch) {
            throw new Error('Could not find darkModeColors or lightModeColors exports');
        }

        // Simple parsing (this assumes specific format in sectionBackgrounds.ts)
        const parseColors = (colorsText: string): SectionColors => {
            const colorRegex = /(\w+):\s*['"`]([^'"`]+)['"`]/g;
            const colors: Partial<SectionColors> = {};
            let match: RegExpExecArray | null;

            // biome-ignore lint/suspicious/noAssignInExpressions: assignment in expression is needed for regex matching loop
            while ((match = colorRegex.exec(colorsText)) !== null) {
                const [, key, value] = match;
                colors[key as keyof SectionColors] = value;
            }

            return {
                hero: colors.hero || '#000000',
                about: colors.about || '#000000',
                skills: colors.skills || '#000000',
                projects: colors.projects || '#000000',
                servicesPreview: colors.servicesPreview || '#000000',
                blog: colors.blog || '#000000',
                services: colors.services || '#000000',
                goodies: colors.goodies || '#000000',
                testimonials: colors.testimonials || '#000000',
                contact: colors.contact || '#000000',
                faqs: colors.faqs || '#000000',
                footer: colors.footer || '#000000'
            };
        };

        return {
            dark: parseColors(darkColorsMatch[1]),
            light: parseColors(lightColorsMatch[1])
        };
    } catch (error) {
        console.error('❌ Error loading colors from source file:', error);
        throw error;
    }
}

/**
 * Generates the complete CSS file content
 */
function generateCompleteCSS(darkColors: SectionColors, lightColors: SectionColors, steps: number): string {
    const timestamp = new Date().toISOString();

    return `/**
 * Auto-generated Section Background Interpolations
 * Generated at: ${timestamp}
 * Source: src/data/sectionBackgrounds.ts
 *
 * DO NOT EDIT THIS FILE MANUALLY
 * Changes will be overwritten on next build
 */

:root {
  /* Section Background Colors - Light Mode */
  --section-hero-bg: ${lightColors.hero.toLowerCase()};
  --section-about-bg: ${lightColors.about.toLowerCase()};
  --section-skills-bg: ${lightColors.skills.toLowerCase()};
  --section-projects-bg: ${lightColors.projects.toLowerCase()};
  --section-services-preview-bg: ${lightColors.servicesPreview.toLowerCase()};
  --section-blog-bg: ${lightColors.blog.toLowerCase()};
  --section-services-bg: ${lightColors.services.toLowerCase()};
  --section-goodies-bg: ${lightColors.goodies.toLowerCase()};
  --section-testimonials-bg: ${lightColors.testimonials.toLowerCase()};
  --section-contact-bg: ${lightColors.contact.toLowerCase()};
  --section-faqs-bg: ${lightColors.faqs.toLowerCase()};
  --section-footer-bg: ${lightColors.footer.toLowerCase()};

${generateTransitionCSS(lightColors, steps).trimEnd()}
}

.dark {
  /* Section Background Colors - Dark Mode */
  --section-hero-bg: ${darkColors.hero.toLowerCase()};
  --section-about-bg: ${darkColors.about.toLowerCase()};
  --section-skills-bg: ${darkColors.skills.toLowerCase()};
  --section-projects-bg: ${darkColors.projects.toLowerCase()};
  --section-services-preview-bg: ${darkColors.servicesPreview.toLowerCase()};
  --section-blog-bg: ${darkColors.blog.toLowerCase()};
  --section-services-bg: ${darkColors.services.toLowerCase()};
  --section-goodies-bg: ${darkColors.goodies.toLowerCase()};
  --section-testimonials-bg: ${darkColors.testimonials.toLowerCase()};
  --section-contact-bg: ${darkColors.contact.toLowerCase()};
  --section-faqs-bg: ${darkColors.faqs.toLowerCase()};
  --section-footer-bg: ${darkColors.footer.toLowerCase()};

${generateTransitionCSS(darkColors, steps).trimEnd()}
}
`;
}

/**
 * Main color interpolation integration
 */
export default function colorInterpolation(options: ColorInterpolationOptions = {}): AstroIntegration {
    const {
        sourceFile = 'src/data/colors.ts',
        outputFile = 'src/styles/generated-colors.css',
        steps = 5,
        watch = true
    } = options;

    let projectRoot: string;

    return {
        name: 'color-interpolation',
        hooks: {
            'astro:config:setup': async ({ config, command }) => {
                projectRoot = fileURLToPath(config.root);

                // Generate colors on setup
                generateColors();

                // Watch for changes in development
                if (command === 'dev' && watch) {
                    const watchPath = join(projectRoot, sourceFile);

                    console.log('🎨 Color interpolation integration initialized');
                    console.log(`📁 Watching: ${sourceFile}`);
                    console.log(`📄 Output: ${outputFile}`);

                    // Setup file watcher
                    let timeout: NodeJS.Timeout | null = null;

                    watchFile(watchPath, { interval: 500 }, () => {
                        // Debounce rapid file changes
                        if (timeout) clearTimeout(timeout);

                        timeout = setTimeout(() => {
                            console.log('🔄 Colors file changed, regenerating...');
                            try {
                                generateColors();
                                console.log('✅ Colors regenerated successfully');
                            } catch (error) {
                                console.error('❌ Error regenerating colors:', error);
                            }
                        }, 200);
                    });

                    // Cleanup on server stop
                    process.on('SIGINT', () => {
                        unwatchFile(watchPath);
                    });
                    process.on('SIGTERM', () => {
                        unwatchFile(watchPath);
                    });
                }
            },

            'astro:build:start': () => {
                // Regenerate colors before build
                generateColors();
            }
        }
    };

    function generateColors() {
        try {
            const outputFilePath = join(projectRoot, outputFile);

            // Ensure output directory exists
            const outputDir = dirname(outputFilePath);
            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true });
            }

            // Load colors from source
            const { dark, light } = loadColorsFromSource(sourceFile);

            // Generate CSS content
            const cssContent = generateCompleteCSS(dark, light, steps);

            // Check if content actually changed (comparing without timestamp header)
            let shouldWrite = true;
            if (existsSync(outputFilePath)) {
                const existingContent = readFileSync(outputFilePath, 'utf-8');

                // Extract CSS without the header comment (which contains timestamp)
                const stripHeader = (content: string) => content.replace(/\/\*\*[\s\S]*?\*\/\n*/m, '').trim();

                const existingCSS = stripHeader(existingContent);
                const newCSS = stripHeader(cssContent);

                shouldWrite = existingCSS !== newCSS;
            }

            // Only write if content changed
            if (shouldWrite) {
                writeFileSync(outputFilePath, cssContent, 'utf-8');
                console.log('✅ Generated color interpolations (content changed)');
                console.log(`   📊 ${Object.keys(dark).length} sections`);
                console.log(`   🎨 ${steps} interpolation steps`);
                console.log(`   📄 Output: ${outputFile}`);
            } else {
                console.log('⏭️  Color interpolations unchanged, skipping write');
            }
        } catch (error) {
            console.error('❌ Failed to generate color interpolations:', error);
            throw error;
        }
    }
}
