import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TranslatedText, useTranslations } from './TranslatedText';

// Mock i18n utilities
vi.mock('@/i18n/utils', () => ({
    getLangFromUrl: vi.fn((url: URL) => {
        const pathname = url.pathname;
        if (pathname.startsWith('/es')) return 'es';
        if (pathname.startsWith('/en')) return 'en';
        return 'en';
    }),
    getTranslations: vi.fn((lang: string) => {
        const translations = {
            en: {
                'nav.home': 'Home',
                'nav.about': 'About',
                'hero.title': 'Welcome to **Our Site**',
                'hero.subtitle': 'The best place to be',
                'welcome.message': 'Hello {name}, you have {count} messages',
                'markdown.test': 'This is **bold** and *italic*',
                'html.test': '<strong>Strong</strong> text',
                'empty.key': '',
                'special.chars': 'Price: $100 & up!'
            },
            es: {
                'nav.home': 'Inicio',
                'nav.about': 'Acerca de',
                'hero.title': 'Bienvenido a **Nuestro Sitio**',
                'hero.subtitle': 'El mejor lugar para estar',
                'welcome.message': 'Hola {name}, tienes {count} mensajes',
                'markdown.test': 'Esto es **negrita** y *cursiva*',
                'html.test': '<strong>Texto</strong> fuerte',
                'empty.key': '',
                'special.chars': 'Precio: $100 y más!'
            }
        };

        return (key: string, options?: { params?: Record<string, unknown>; markdown?: boolean; fallback?: string }) => {
            const langTranslations = translations[lang as keyof typeof translations] || translations.en;
            let text = langTranslations[key as keyof typeof langTranslations] || options?.fallback || key;

            // Handle params substitution
            if (options?.params) {
                Object.entries(options.params).forEach(([param, value]) => {
                    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
                });
            }

            // Handle markdown (simplified)
            if (options?.markdown) {
                text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
            }

            return text;
        };
    })
}));

describe('TranslatedText Component', () => {
    beforeEach(() => {
        // Mock window.location
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                href: 'http://localhost:3000/en/page',
                pathname: '/en/page'
            }
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should render translated text', () => {
            render(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });

        it('should render with default span element', () => {
            const { container } = render(<TranslatedText textKey="nav.home" />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
            expect(span?.textContent).toBe('Home');
        });

        it('should render with custom element', () => {
            const { container } = render(<TranslatedText textKey="hero.title" as="h1" />);
            const h1 = container.querySelector('h1');
            expect(h1).toBeInTheDocument();
        });

        it('should apply className', () => {
            const { container } = render(<TranslatedText textKey="nav.home" className="text-lg font-bold" />);
            const span = container.querySelector('span');
            expect(span).toHaveClass('text-lg', 'font-bold');
        });
    });

    describe('Language Detection', () => {
        it('should detect English from URL', () => {
            window.location.href = 'http://localhost:3000/en/about';
            render(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });

        it('should detect Spanish from URL', () => {
            window.location.href = 'http://localhost:3000/es/about';
            render(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Inicio')).toBeInTheDocument();
        });

        it('should default to English when no language in URL', () => {
            window.location.href = 'http://localhost:3000/about';
            render(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });
    });

    describe('Parameters Substitution', () => {
        it('should replace single parameter', () => {
            render(<TranslatedText textKey="welcome.message" params={{ name: 'John', count: 5 }} />);
            expect(screen.getByText('Hello John, you have 5 messages')).toBeInTheDocument();
        });

        it('should replace multiple parameters', () => {
            render(<TranslatedText textKey="welcome.message" params={{ name: 'María', count: 10 }} />);
            expect(screen.getByText('Hello María, you have 10 messages')).toBeInTheDocument();
        });

        it('should handle numeric parameters', () => {
            render(<TranslatedText textKey="welcome.message" params={{ name: 'User', count: 0 }} />);
            expect(screen.getByText('Hello User, you have 0 messages')).toBeInTheDocument();
        });

        it('should handle empty params object', () => {
            render(<TranslatedText textKey="nav.home" params={{}} />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });
    });

    describe('Markdown Support', () => {
        it('should render markdown as plain text when markdown=false', () => {
            render(<TranslatedText textKey="hero.title" markdown={false} />);
            expect(screen.getByText('Welcome to **Our Site**')).toBeInTheDocument();
        });

        it('should render markdown as HTML when markdown=true', () => {
            const { container } = render(<TranslatedText textKey="hero.title" markdown={true} />);
            const strong = container.querySelector('strong');
            expect(strong).toBeInTheDocument();
            expect(strong?.textContent).toBe('Our Site');
        });

        it('should render bold markdown', () => {
            const { container } = render(<TranslatedText textKey="markdown.test" markdown={true} />);
            const strong = container.querySelector('strong');
            expect(strong?.textContent).toBe('bold');
        });

        it('should render italic markdown', () => {
            const { container } = render(<TranslatedText textKey="markdown.test" markdown={true} />);
            const em = container.querySelector('em');
            expect(em?.textContent).toBe('italic');
        });

        it('should combine markdown with params', () => {
            const { container } = render(
                <TranslatedText textKey="welcome.message" params={{ name: '**John**', count: 5 }} markdown={true} />
            );
            const text = container.textContent;
            expect(text).toContain('John');
        });
    });

    describe('dangerouslySetInnerHTML', () => {
        it('should render HTML when dangerouslySetInnerHTML=true', () => {
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Testing dangerouslySetInnerHTML prop behavior with trusted content
            const { container } = render(<TranslatedText textKey="html.test" dangerouslySetInnerHTML={true} />);
            const strong = container.querySelector('strong');
            expect(strong).toBeInTheDocument();
            expect(strong?.textContent).toBe('Strong');
        });

        it('should escape HTML when dangerouslySetInnerHTML=false', () => {
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Testing HTML escaping behavior
            render(<TranslatedText textKey="html.test" dangerouslySetInnerHTML={false} />);
            expect(screen.getByText('<strong>Strong</strong> text')).toBeInTheDocument();
        });

        it('should use dangerouslySetInnerHTML when markdown is enabled', () => {
            const { container } = render(<TranslatedText textKey="hero.title" markdown={true} />);
            const span = container.querySelector('span');
            expect(span?.innerHTML).toContain('<strong>');
        });
    });

    describe('Fallback Handling', () => {
        it('should use fallback when key not found', () => {
            render(<TranslatedText textKey="nonexistent.key" fallback="Fallback Text" />);
            expect(screen.getByText('Fallback Text')).toBeInTheDocument();
        });

        it('should return key when no fallback provided', () => {
            render(<TranslatedText textKey="nonexistent.key" />);
            expect(screen.getByText('nonexistent.key')).toBeInTheDocument();
        });

        it('should prefer translation over fallback when key exists', () => {
            render(<TranslatedText textKey="nav.home" fallback="Should not appear" />);
            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
        });
    });

    describe('Custom Elements', () => {
        it('should render as h1 element', () => {
            const { container } = render(<TranslatedText textKey="hero.title" as="h1" />);
            const h1 = container.querySelector('h1');
            expect(h1).toBeInTheDocument();
        });

        it('should render as p element', () => {
            const { container } = render(<TranslatedText textKey="hero.subtitle" as="p" />);
            const p = container.querySelector('p');
            expect(p).toBeInTheDocument();
        });

        it('should render as div element', () => {
            const { container } = render(<TranslatedText textKey="nav.home" as="div" />);
            const div = container.querySelector('div');
            expect(div).toBeInTheDocument();
        });

        it('should render as button element', () => {
            const { container } = render(<TranslatedText textKey="nav.home" as="button" />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });
    });

    describe('Element Props', () => {
        it('should pass elementProps to element', () => {
            const { container } = render(
                <TranslatedText textKey="nav.home" elementProps={{ 'data-testid': 'custom-id', role: 'heading' }} />
            );
            const span = container.querySelector('span');
            expect(span).toHaveAttribute('data-testid', 'custom-id');
            expect(span).toHaveAttribute('role', 'heading');
        });

        it('should pass aria attributes', () => {
            const { container } = render(
                <TranslatedText textKey="nav.home" elementProps={{ 'aria-label': 'Home navigation' }} />
            );
            const span = container.querySelector('span');
            expect(span).toHaveAttribute('aria-label', 'Home navigation');
        });

        it('should combine className with elementProps', () => {
            const { container } = render(
                <TranslatedText textKey="nav.home" className="text-lg" elementProps={{ 'data-test': 'value' }} />
            );
            const span = container.querySelector('span');
            expect(span).toHaveClass('text-lg');
            expect(span).toHaveAttribute('data-test', 'value');
        });
    });

    describe('Special Characters', () => {
        it('should handle special characters in text', () => {
            render(<TranslatedText textKey="special.chars" />);
            expect(screen.getByText('Price: $100 & up!')).toBeInTheDocument();
        });

        it('should handle special characters in params', () => {
            render(<TranslatedText textKey="welcome.message" params={{ name: 'John & Jane', count: 5 }} />);
            expect(screen.getByText('Hello John & Jane, you have 5 messages')).toBeInTheDocument();
        });
    });

    describe('Memoization', () => {
        it('should memoize translated text', () => {
            const { rerender } = render(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();

            // Re-render with same props
            rerender(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });

        it('should update when textKey changes', () => {
            const { rerender } = render(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();

            rerender(<TranslatedText textKey="nav.about" />);
            expect(screen.getByText('About')).toBeInTheDocument();
        });

        it('should update when params change', () => {
            const { rerender } = render(
                <TranslatedText textKey="welcome.message" params={{ name: 'John', count: 5 }} />
            );
            expect(screen.getByText('Hello John, you have 5 messages')).toBeInTheDocument();

            rerender(<TranslatedText textKey="welcome.message" params={{ name: 'Jane', count: 3 }} />);
            expect(screen.getByText('Hello Jane, you have 3 messages')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined params', () => {
            render(<TranslatedText textKey="nav.home" params={undefined} />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });

        it('should handle empty string className', () => {
            const { container } = render(<TranslatedText textKey="nav.home" className="" />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });

        it('should handle multiple re-renders', () => {
            const { rerender } = render(<TranslatedText textKey="nav.home" />);
            rerender(<TranslatedText textKey="nav.about" />);
            rerender(<TranslatedText textKey="nav.home" />);
            expect(screen.getByText('Home')).toBeInTheDocument();
        });
    });
});

describe('useTranslations Hook', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                href: 'http://localhost:3000/en/page',
                pathname: '/en/page'
            }
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return translation function', () => {
        function TestComponent() {
            const t = useTranslations();
            const text = t('nav.home');
            return <div>{text}</div>;
        }

        render(<TestComponent />);
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should translate with params', () => {
        function TestComponent() {
            const t = useTranslations();
            const text = t('welcome.message', { params: { name: 'John', count: 5 } });
            return <div>{text}</div>;
        }

        render(<TestComponent />);
        expect(screen.getByText('Hello John, you have 5 messages')).toBeInTheDocument();
    });

    it('should support markdown', () => {
        function TestComponent() {
            const t = useTranslations();
            const text = t('hero.title', { markdown: true });
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Testing markdown rendering with trusted translation content
            return <div dangerouslySetInnerHTML={{ __html: text }} />;
        }

        const { container } = render(<TestComponent />);
        const strong = container.querySelector('strong');
        expect(strong?.textContent).toBe('Our Site');
    });

    it('should detect language from URL', () => {
        window.location.href = 'http://localhost:3000/es/page';

        function TestComponent() {
            const t = useTranslations();
            const text = t('nav.home');
            return <div>{text}</div>;
        }

        render(<TestComponent />);
        expect(screen.getByText('Inicio')).toBeInTheDocument();
    });

    it('should use fallback', () => {
        function TestComponent() {
            const t = useTranslations();
            const text = t('nonexistent.key', { fallback: 'Default Text' });
            return <div>{text}</div>;
        }

        render(<TestComponent />);
        expect(screen.getByText('Default Text')).toBeInTheDocument();
    });
});
