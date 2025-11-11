/**
 * Astro Integration: Color Interpolation Generator
 * Automatically generates CSS interpolations from src/data/colors.ts
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  unwatchFile,
  watchFile,
  writeFileSync,
} from 'node:fs';
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
  blog: string;
  testimonials: string;
  contact: string;
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
    { name: 'projects-to-blog', from: colors.projects, to: colors.blog },
    { name: 'blog-to-testimonials', from: colors.blog, to: colors.testimonials },
    { name: 'testimonials-to-contact', from: colors.testimonials, to: colors.contact },
    { name: 'contact-to-footer', from: colors.contact, to: colors.footer },
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

    // Simple parsing (this assumes specific format in colors.ts)
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
        blog: colors.blog || '#000000',
        testimonials: colors.testimonials || '#000000',
        contact: colors.contact || '#000000',
        footer: colors.footer || '#000000',
      };
    };

    return {
      dark: parseColors(darkColorsMatch[1]),
      light: parseColors(lightColorsMatch[1]),
    };
  } catch (error) {
    console.error('❌ Error loading colors from source file:', error);
    throw error;
  }
}

/**
 * Generates the complete CSS file content
 */
function generateCompleteCSS(
  darkColors: SectionColors,
  lightColors: SectionColors,
  steps: number,
): string {
  const timestamp = new Date().toISOString();

  return `/**
 * Auto-generated Color Interpolations
 * Generated at: ${timestamp}
 * Source: src/data/colors.ts
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
  --section-blog-bg: ${lightColors.blog.toLowerCase()};
  --section-testimonials-bg: ${lightColors.testimonials.toLowerCase()};
  --section-contact-bg: ${lightColors.contact.toLowerCase()};
  --section-footer-bg: ${lightColors.footer.toLowerCase()};

${generateTransitionCSS(lightColors, steps).trimEnd()}
}

.dark {
  /* Section Background Colors - Dark Mode */
  --section-hero-bg: ${darkColors.hero.toLowerCase()};
  --section-about-bg: ${darkColors.about.toLowerCase()};
  --section-skills-bg: ${darkColors.skills.toLowerCase()};
  --section-projects-bg: ${darkColors.projects.toLowerCase()};
  --section-blog-bg: ${darkColors.blog.toLowerCase()};
  --section-testimonials-bg: ${darkColors.testimonials.toLowerCase()};
  --section-contact-bg: ${darkColors.contact.toLowerCase()};
  --section-footer-bg: ${darkColors.footer.toLowerCase()};

${generateTransitionCSS(darkColors, steps).trimEnd()}
}
`;
}

/**
 * Main color interpolation integration
 */
export default function colorInterpolation(
  options: ColorInterpolationOptions = {},
): AstroIntegration {
  const {
    sourceFile = 'src/data/colors.ts',
    outputFile = 'src/styles/generated-colors.css',
    steps = 5,
    watch = true,
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
      },
    },
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
      const { dark, light } = loadColorsFromSource(sourceFile); // Generate CSS
      const cssContent = generateCompleteCSS(dark, light, steps);

      // Write to output file
      writeFileSync(outputFilePath, cssContent, 'utf-8');

      console.log('✅ Generated color interpolations');
      console.log(`   📊 ${Object.keys(dark).length} sections`);
      console.log(`   🎨 ${steps} interpolation steps`);
      console.log(`   📄 Output: ${outputFile}`);
    } catch (error) {
      console.error('❌ Failed to generate color interpolations:', error);
      throw error;
    }
  }
}
