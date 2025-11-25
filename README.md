# qazuor.com

Personal portfolio and technical blog built with Astro, React, and TailwindCSS.

## Performance Metrics

This project is optimized for Core Web Vitals and achieves excellent performance
scores:

| Metric            | Target  | Current | Status           |
| ----------------- | ------- | ------- | ---------------- |
| LCP               | < 2.5s  | ~271ms  | Excellent        |
| FCP               | < 1.8s  | ~271ms  | Excellent        |
| CLS               | < 0.1   | 0.00    | Excellent        |
| DOM Elements      | < 2000  | 1655    | 17% under budget |
| JS Bundle (gzip)  | < 500KB | 308KB   | 38% under budget |
| CSS Bundle (gzip) | < 100KB | 40KB    | 60% under budget |

### Performance Optimizations

- Critical CSS inlined for instant hero render
- Font preloading (3 critical fonts with `font-display: swap`)
- LCP image preloaded with `fetchpriority="high"`
- SVG sprite for timeline icons (99.3% reduction: 393KB to 2.6KB)
- Manual chunking for optimal caching
- Lazy loading with `client:visible` for below-fold components
- Brotli/Gzip/Zstd compression

For detailed performance documentation, see
[docs/PERFORMANCE.md](docs/PERFORMANCE.md).

## Tech Stack

- **Framework:** Astro (SSG)
- **UI Components:** React 19 (Islands Architecture)
- **Styling:** TailwindCSS
- **Animations:** GSAP + Lenis
- **Content:** Astro Content Collections
- **Language:** TypeScript
- **Deployment:** Vercel

## Project Structure

```text
qazuor.com/
├── src/
│   ├── components/       # React components (islands)
│   ├── layouts/          # Astro layouts
│   ├── pages/            # Astro pages (routes)
│   ├── content/          # Content collections (blog, projects)
│   ├── styles/           # Global styles and fonts
│   ├── i18n/             # Internationalization (en/es)
│   └── icons/            # SVG icons
├── public/               # Static assets
├── docs/                 # Project documentation
└── .claude/              # AI agents, commands, skills
```

## Commands

| Command              | Action                               |
| :------------------- | :----------------------------------- |
| `npm install`        | Install dependencies                 |
| `npm run dev`        | Start dev server at `localhost:4321` |
| `npm run build`      | Build production site to `./dist/`   |
| `npm run preview`    | Preview production build locally     |
| `npm run typecheck`  | Run TypeScript type checking         |
| `npm run lint`       | Lint code                            |
| `npm run test`       | Run tests                            |
| `npm run lighthouse` | Run Lighthouse audit                 |

## Features

- Bilingual support (English/Spanish)
- Dark mode (default)
- View Transitions API for smooth navigation
- Command Palette (Ctrl+K)
- Accessible (WCAG 2.1 Level AA)
- SEO optimized with structured data
- PWA ready with web manifest

## License

MIT
