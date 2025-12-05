import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import type { SatoriOptions } from 'satori';
import satori from 'satori';

/**
 * OG Image Generator
 *
 * Generates Open Graph images using Satori (JSX to SVG) and Resvg (SVG to PNG)
 * Images are generated at build time for static hosting.
 */

export interface OgImageOptions {
    title: string;
    subtitle?: string;
    tags?: string[];
    type?: 'home' | 'blog' | 'project' | 'page' | 'service' | 'goodies' | 'css-trick' | 'snippet' | 'tool' | 'link';
    accentColor?: string;
    lang?: 'en' | 'es';
}

// Cache photo image as base64
let photoCache: string | null = null;

async function loadPhotoBase64(): Promise<string> {
    if (photoCache) {
        return photoCache;
    }

    const photoPath = join(process.cwd(), 'src', 'assets', 'images', 'photo1.png');
    const photoBuffer = await readFile(photoPath);
    photoCache = `data:image/png;base64,${photoBuffer.toString('base64')}`;

    return photoCache;
}

// OG Image dimensions (recommended by social platforms)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Bottom bar height
const BOTTOM_BAR_HEIGHT = 60;

/**
 * Truncate text at word boundary to avoid cutting words
 */
function truncateAtWord(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    // Find the last space before maxLength
    const truncated = text.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex === -1) {
        // No space found, just truncate
        return `${truncated}...`;
    }

    return `${truncated.slice(0, lastSpaceIndex)}...`;
}

// Brand colors
const COLORS = {
    background: '#0f0a1e', // Dark purple background
    backgroundGradient: '#1a0f2e',
    text: '#f8fafc', // Light text
    textMuted: '#94a3b8', // Muted text
    accent: '#8b5cf6', // Purple accent
    accentSecondary: '#3b82f6', // Blue accent
    barBackground: '#0a0612' // Darker bar background
};

// Cache fonts to avoid fetching multiple times
let fontsCache: SatoriOptions['fonts'] | null = null;

// Load font data (Inter) from Google Fonts CDN (woff format - required by Satori)
async function loadFonts(): Promise<SatoriOptions['fonts']> {
    if (fontsCache) {
        return fontsCache;
    }

    // Fetch fonts directly from Google Fonts CDN (TTF format)
    const [fontRegular, fontBold, fontBlack] = await Promise.all([
        fetch(
            'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
        ).then((res) => res.arrayBuffer()),
        fetch(
            'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff'
        ).then((res) => res.arrayBuffer()),
        fetch(
            'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYAZ9hjp-Ek-_EeA.woff'
        ).then((res) => res.arrayBuffer())
    ]);

    fontsCache = [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontBlack, weight: 900, style: 'normal' }
    ];

    return fontsCache;
}

// Generate the OG image template as Satori-compatible JSX object
function createOgTemplate(options: OgImageOptions & { photoBase64: string }) {
    const { title, subtitle, tags = [], type = 'page', accentColor = COLORS.accent, photoBase64 } = options;

    // Type badge text
    const typeBadge = {
        home: '🏠 Portfolio',
        blog: '📝 Blog',
        project: '🚀 Project',
        page: '📄 Page',
        service: '💼 Service',
        goodies: '🎁 Goodies',
        'css-trick': '🎨 CSS Trick',
        snippet: '✂️ Snippet',
        tool: '🔧 Tool',
        link: '🔗 Links'
    }[type];

    // Photo height - starts from top and ends at the bottom bar
    const photoHeight = OG_HEIGHT - BOTTOM_BAR_HEIGHT;

    return {
        type: 'div',
        props: {
            style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundGradient} 100%)`,
                fontFamily: 'Inter',
                overflow: 'hidden'
            },
            children: [
                // Main content area (above bottom bar)
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            flex: 1,
                            position: 'relative'
                        },
                        children: [
                            // Left section - Content with padding
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        padding: '50px 50px 30px 50px',
                                        flex: 1
                                    },
                                    children: [
                                        // Top section - Type badge
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                background: accentColor,
                                                                color: COLORS.text,
                                                                padding: '8px 20px',
                                                                borderRadius: '9999px',
                                                                fontSize: '18px',
                                                                fontWeight: 600
                                                            },
                                                            children: typeBadge
                                                        }
                                                    }
                                                ]
                                            }
                                        },

                                        // Middle section - Title and subtitle
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '16px',
                                                    flex: 1,
                                                    justifyContent: 'center'
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                fontSize: title.length > 50 ? '40px' : '52px',
                                                                fontWeight: 900,
                                                                color: COLORS.text,
                                                                lineHeight: 1.1,
                                                                maxWidth: '650px'
                                                            },
                                                            children: title
                                                        }
                                                    },
                                                    subtitle
                                                        ? {
                                                              type: 'div',
                                                              props: {
                                                                  style: {
                                                                      fontSize: '22px',
                                                                      color: COLORS.textMuted,
                                                                      maxWidth: '600px',
                                                                      lineHeight: 1.4
                                                                  },
                                                                  children: truncateAtWord(subtitle, 100)
                                                              }
                                                          }
                                                        : null
                                                ].filter(Boolean)
                                            }
                                        },

                                        // Bottom section - Tags only
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'flex-end'
                                                },
                                                children: [
                                                    // Tags
                                                    tags.length > 0
                                                        ? {
                                                              type: 'div',
                                                              props: {
                                                                  style: {
                                                                      display: 'flex',
                                                                      gap: '8px',
                                                                      flexWrap: 'wrap',
                                                                      maxWidth: '480px'
                                                                  },
                                                                  children: tags.slice(0, 4).map((tag) => ({
                                                                      type: 'div',
                                                                      props: {
                                                                          style: {
                                                                              background: 'rgba(139, 92, 246, 0.2)',
                                                                              border: '1px solid rgba(139, 92, 246, 0.4)',
                                                                              color: COLORS.accent,
                                                                              padding: '5px 14px',
                                                                              borderRadius: '6px',
                                                                              fontSize: '14px',
                                                                              fontWeight: 600
                                                                          },
                                                                          children: tag
                                                                      }
                                                                  }))
                                                              }
                                                          }
                                                        : { type: 'div', props: { children: '' } }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            // Right section - Photo (sits above bottom bar)
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        position: 'absolute',
                                        right: '0',
                                        bottom: '0',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-end'
                                    },
                                    children: [
                                        {
                                            type: 'img',
                                            props: {
                                                src: photoBase64,
                                                height: photoHeight,
                                                style: {
                                                    objectFit: 'contain',
                                                    objectPosition: 'bottom right'
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Bottom bar - full width with top border only
                {
                    type: 'div',
                    props: {
                        style: {
                            width: '100%',
                            height: `${BOTTOM_BAR_HEIGHT}px`,
                            background: COLORS.barBackground,
                            borderTop: '2px solid rgba(139, 92, 246, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '120px'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '24px',
                                        fontWeight: 700,
                                        color: COLORS.text
                                    },
                                    children: 'qazuor.com'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
}

/**
 * Generate an OG image as PNG ArrayBuffer
 */
export async function generateOgImage(options: OgImageOptions): Promise<ArrayBuffer> {
    // Always load the photo
    const photoBase64 = await loadPhotoBase64();

    const template = createOgTemplate({ ...options, photoBase64 });
    const fonts = await loadFonts();

    // Generate SVG with Satori
    // biome-ignore lint/suspicious/noExplicitAny: Satori's JSX types don't match React 19 types
    const svg = await satori(template as any, {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts
    });

    // Convert SVG to PNG with Resvg
    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: OG_WIDTH
        }
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Convert Buffer to ArrayBuffer for Response compatibility
    // Use Uint8Array to ensure proper ArrayBuffer type
    return new Uint8Array(pngBuffer).buffer;
}

/**
 * Generate OG image and return as Response
 */
export async function generateOgImageResponse(options: OgImageOptions): Promise<Response> {
    const png = await generateOgImage(options);

    return new Response(png, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
}
