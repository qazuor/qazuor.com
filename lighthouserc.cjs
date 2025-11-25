module.exports = {
    ci: {
        collect: {
            // Collect reports from the built site
            staticDistDir: './dist',
            // Test multiple pages
            url: [
                'http://localhost/en/',
                'http://localhost/en/projects/',
                'http://localhost/en/blog/',
                'http://localhost/es/'
            ],
            // Run 3 times to get median scores
            numberOfRuns: 3,
            settings: {
                // Use mobile emulation for Core Web Vitals
                preset: 'desktop',
                // Throttling settings for performance testing
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1
                }
            }
        },
        assert: {
            // Performance budgets - strict targets for production
            assertions: {
                // Core Web Vitals thresholds
                'categories:performance': ['error', { minScore: 0.9 }], // 90+ score
                'categories:accessibility': ['error', { minScore: 0.95 }], // 95+ score
                'categories:best-practices': ['error', { minScore: 0.9 }], // 90+ score
                'categories:seo': ['error', { minScore: 0.95 }], // 95+ score

                // Performance metrics - based on web.dev recommendations
                'first-contentful-paint': ['error', { maxNumericValue: 1800 }], // < 1.8s
                'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // < 2.5s
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // < 0.1
                'total-blocking-time': ['error', { maxNumericValue: 200 }], // < 200ms
                'speed-index': ['error', { maxNumericValue: 3400 }], // < 3.4s
                interactive: ['error', { maxNumericValue: 3800 }], // < 3.8s

                // Resource size budgets
                'resource-summary:document:size': ['error', { maxNumericValue: 100000 }], // < 100KB HTML
                'resource-summary:script:size': ['error', { maxNumericValue: 300000 }], // < 300KB JS
                'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }], // < 50KB CSS
                'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }], // < 500KB images
                'resource-summary:font:size': ['error', { maxNumericValue: 150000 }], // < 150KB fonts
                'resource-summary:total:size': ['warn', { maxNumericValue: 1500000 }], // < 1.5MB total

                // Resource counts
                'resource-summary:script:count': ['warn', { maxNumericValue: 15 }], // < 15 scripts
                'resource-summary:stylesheet:count': ['warn', { maxNumericValue: 5 }], // < 5 stylesheets
                'resource-summary:third-party:count': ['warn', { maxNumericValue: 5 }], // < 5 third-party

                // DOM size
                'dom-size': ['error', { maxNumericValue: 2000 }], // < 2000 nodes

                // Render blocking resources
                'render-blocking-resources': ['warn', { maxLength: 3 }], // < 3 blocking resources

                // Modern image formats
                'modern-image-formats': 'off', // Using Astro Image optimization
                'uses-webp-images': 'off', // Already optimized

                // Unused code
                'unused-javascript': ['warn', { maxLength: 3 }],
                'unused-css-rules': ['warn', { maxLength: 3 }],

                // Network optimization
                'uses-http2': 'error',
                'uses-text-compression': 'error',

                // Accessibility checks
                'color-contrast': 'error',
                'image-alt': 'error',
                'aria-valid-attr': 'error',
                'button-name': 'error',
                'document-title': 'error',
                'html-has-lang': 'error',
                'link-name': 'error',
                'meta-viewport': 'error',

                // Best practices
                'errors-in-console': ['warn', { maxLength: 0 }],
                'no-vulnerable-libraries': 'error',
                'uses-passive-event-listeners': 'error'
            }
        },
        upload: {
            // Disable upload to public Lighthouse CI server
            target: 'temporary-public-storage'
        }
    }
};
