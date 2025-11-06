import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

interface AboutProps {
  name?: string;
  role?: string;
  location?: string;
  experience?: string;
  email?: string;
  availability?: string;
  bio?: string;
  translations?: {
    title: string;
    subtitle: string;
    connect: string;
  };
}

export function About({
  name = 'qazuor',
  role = 'Full-Stack Developer',
  location = 'Remote',
  experience = '5+ years',
  email = 'hello@qazuor.com',
  availability = 'Open to opportunities',
  bio = 'Passionate about creating exceptional digital experiences with modern web technologies. Specialized in React, TypeScript, and performance optimization.',
  translations = {
    title: 'About Me',
    subtitle: 'Get to know me through code',
    connect: "Let's build something amazing together!",
  },
}: AboutProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!codeRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // GSAP scroll-triggered animation
    gsap.from(codeRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: codeRef.current,
        start: 'top 80%',
        end: 'top 60%',
        toggleActions: 'play none none none',
      },
    });

    // Animate code lines with stagger
    const lines = codeRef.current.querySelectorAll('.code-line');
    gsap.from(lines, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: codeRef.current,
        start: 'top 70%',
        end: 'top 50%',
        toggleActions: 'play none none none',
      },
    });

    // Highlight effect on scroll - progressive reveal
    lines.forEach((line, _index) => {
      gsap.fromTo(
        line,
        {
          backgroundColor: 'transparent',
        },
        {
          backgroundColor: 'rgba(var(--primary) / 0.1)',
          duration: 0.3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 75%',
            end: 'top 60%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
              gsap.to(line, {
                backgroundColor: 'rgba(var(--primary) / 0.1)',
                duration: 0.3,
              });
            },
            onLeaveBack: () => {
              gsap.to(line, {
                backgroundColor: 'transparent',
                duration: 0.3,
              });
            },
          },
        },
      );
    });
  }, []);

  return (
    <section className="section">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">{translations.title}</span>
            </h2>
            <p className="text-foreground-secondary text-lg">{translations.subtitle}</p>
          </div>

          {/* Code Block */}
          <div
            ref={codeRef}
            className="relative bg-background-secondary rounded-lg border border-foreground/10 overflow-hidden"
          >
            {/* Code Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-background-tertiary">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <span className="ml-2 text-sm text-foreground-secondary font-mono">developer.js</span>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-sm md:text-base overflow-x-auto">
              <div className="code-line px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-syntax-keyword">const</span>{' '}
                <span className="text-foreground">developer</span>{' '}
                <span className="text-foreground-secondary">=</span>{' '}
                <span className="text-foreground-secondary">{'{'}</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">name</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{name}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">role</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{role}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">location</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{location}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">experience</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{experience}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">email</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{email}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">availability</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{availability}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">bio</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-string">'{bio}'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">skills</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-foreground-secondary">[</span>
              </div>

              <div className="code-line ml-8 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-syntax-string">'React'</span>
                <span className="text-foreground-secondary">,</span>{' '}
                <span className="text-syntax-string">'TypeScript'</span>
                <span className="text-foreground-secondary">,</span>{' '}
                <span className="text-syntax-string">'Node.js'</span>
                <span className="text-foreground-secondary">,</span>
              </div>

              <div className="code-line ml-8 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-syntax-string">'Astro'</span>
                <span className="text-foreground-secondary">,</span>{' '}
                <span className="text-syntax-string">'GSAP'</span>
                <span className="text-foreground-secondary">,</span>{' '}
                <span className="text-syntax-string">'Tailwind CSS'</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-foreground-secondary">],</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-primary">connect</span>
                <span className="text-foreground-secondary">:</span>{' '}
                <span className="text-syntax-keyword">function</span>
                <span className="text-foreground-secondary">() {'{'}</span>
              </div>

              <div className="code-line ml-8 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-syntax-keyword">return</span>{' '}
                <span className="text-syntax-string">"{translations.connect}"</span>
                <span className="text-foreground-secondary">;</span>
              </div>

              <div className="code-line ml-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-foreground-secondary">{'}'}</span>
              </div>

              <div className="code-line px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-foreground-secondary">{'};'}</span>
              </div>

              <div className="code-line mt-4 px-2 py-1 -mx-2 rounded transition-colors duration-300">
                <span className="text-syntax-keyword">export default</span>{' '}
                <span className="text-foreground">developer</span>
                <span className="text-foreground-secondary">;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
