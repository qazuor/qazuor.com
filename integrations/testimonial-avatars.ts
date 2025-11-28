import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestimonialAvatarsOptions {
    verbose?: boolean;
}

export default function testimonialAvatarsIntegration(options: TestimonialAvatarsOptions = {}): AstroIntegration {
    const { verbose = true } = options;

    return {
        name: 'testimonial-avatars',
        hooks: {
            'astro:config:setup': () => {
                if (verbose) {
                    console.log('\n🖼️  Testimonial Avatars: Initializing...');
                }
            },

            'astro:build:start': async () => {
                await downloadAvatars(verbose);
            },

            'astro:server:start': async () => {
                await downloadAvatars(verbose);
            }
        }
    };
}

async function downloadAvatars(verbose: boolean) {
    const testimonialsDir = join(__dirname, '../src/content/testimonials');
    // Store avatars in src/content for Astro Image optimization
    const avatarsDir = join(__dirname, '../src/content/testimonials/_avatars');

    // Ensure avatars directory exists
    if (!existsSync(avatarsDir)) {
        mkdirSync(avatarsDir, { recursive: true });
        if (verbose) {
            console.log('   📁 Created src/content/testimonials/_avatars directory');
        }
    }

    // Find all testimonial markdown files
    const testimonialFiles = await glob('*.md', { cwd: testimonialsDir });

    if (verbose) {
        console.log(`   📄 Found ${testimonialFiles.length} testimonial files`);
    }

    let downloadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const file of testimonialFiles) {
        const filePath = join(testimonialsDir, file);
        const content = readFileSync(filePath, 'utf8');

        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) continue;

        const frontmatter = frontmatterMatch[1];

        // Check if avatarUrl exists
        const avatarUrlMatch = frontmatter.match(/avatarUrl:\s*['"]?(https?:\/\/[^'"\n]+)['"]?/);
        if (!avatarUrlMatch) continue;

        const avatarUrl = avatarUrlMatch[1];

        // Generate filename from testimonial file name
        const baseName = file.replace('.md', '');
        const urlExt = getExtensionFromUrl(avatarUrl) || '.jpg';
        const avatarFileName = `${baseName}${urlExt}`;
        const avatarPath = join(avatarsDir, avatarFileName);
        // Use relative path for Astro content collection image optimization
        const avatarRelativePath = `./_avatars/${avatarFileName}`;

        // Check if already has correct avatar path
        const existingAvatarMatch = frontmatter.match(/avatar:\s*['"]?([^'"\n]+)['"]?/);
        const existingAvatar = existingAvatarMatch?.[1];

        if (existingAvatar === avatarRelativePath && existsSync(avatarPath)) {
            skippedCount++;
            continue;
        }

        // Download the image
        try {
            await downloadImage(avatarUrl, avatarPath);
            downloadedCount++;

            if (verbose) {
                console.log(`   ✓ Downloaded avatar for ${baseName}`);
            }

            // Update the frontmatter with local avatar path
            let updatedFrontmatter = frontmatter;

            if (existingAvatarMatch) {
                // Replace existing avatar
                updatedFrontmatter = frontmatter.replace(
                    /avatar:\s*['"]?[^'"\n]+['"]?/,
                    `avatar: '${avatarRelativePath}'`
                );
            } else {
                // Add avatar after avatarUrl
                updatedFrontmatter = frontmatter.replace(
                    /(avatarUrl:\s*['"]?https?:\/\/[^'"\n]+['"]?)/,
                    `$1\navatar: '${avatarRelativePath}'`
                );
            }

            // Write updated content
            const updatedContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${updatedFrontmatter}\n---`);

            writeFileSync(filePath, updatedContent, 'utf8');
        } catch (error) {
            errorCount++;
            if (verbose) {
                console.error(`   ❌ Failed to download avatar for ${baseName}:`, error);
            }
        }
    }

    if (verbose) {
        console.log(
            `\n✅ Testimonial Avatars: ${downloadedCount} downloaded, ${skippedCount} skipped, ${errorCount} errors\n`
        );
    }
}

async function downloadImage(url: string, destPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;

        const request = protocol.get(url, (response) => {
            // Handle redirects
            if (
                response.statusCode &&
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location
            ) {
                downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
                return;
            }

            const fileStream = createWriteStream(destPath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (err) => {
                fileStream.close();
                reject(err);
            });
        });

        request.on('error', reject);
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error(`Timeout downloading ${url}`));
        });
    });
}

function getExtensionFromUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const ext = extname(pathname).toLowerCase();

        // Common image extensions
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) {
            return ext;
        }

        // Default to jpg for unknown extensions
        return '.jpg';
    } catch {
        return '.jpg';
    }
}
