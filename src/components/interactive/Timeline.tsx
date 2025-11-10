'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { timelineData, timelineTranslations } from '../../data/timeline';

interface TimelineProps {
  lang: 'en' | 'es';
}

export default function Timeline({ lang }: TimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = timelineTranslations[lang];
  const items =
    lang === 'en'
      ? timelineData.map((item, index) => ({ ...item, ...t.items[index] }))
      : timelineData;

  // Auto-advance timeline
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 2000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, items.length]);

  // Icon components mapping
  const getIcon = (iconName: string) => {
    const icons = {
      code: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      react: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.89-1.87 1.89c-1.03 0-1.87-.84-1.87-1.89s.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.95-1.44-.54-.69-1.10-1.32-1.68-1.92-.58.6-1.14 1.23-1.68 1.92-.33.44-.65.91-.95 1.44l-.81 1.5.81 1.5c.3.53.62 1 .95 1.44.54.69 1.10 1.32 1.68 1.92.58-.6 1.14-1.23 1.68-1.92.33-.44.65-.91.95-1.44M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95z" />
        </svg>
      ),
      server: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
      briefcase: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V6"
          />
        </svg>
      ),
      typescript: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
        </svg>
      ),
      star: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      rocket: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      present: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };

    return icons[iconName as keyof typeof icons] || icons.code;
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-hero">{t.title}</h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2">
            {/* Progress Line */}
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary"
              style={{
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  ${items[activeIndex]?.color || '#06b6d4'} ${(activeIndex / (items.length - 1)) * 100}%, 
                  transparent ${(activeIndex / (items.length - 1)) * 100 + 10}%
                )`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Timeline Items */}
          <div className="flex justify-between items-center relative z-10">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative flex flex-col items-center cursor-pointer group"
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setIsPaused(true);
                }}
                onMouseLeave={() => setIsPaused(false)}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Timeline Dot */}
                <motion.div
                  className={`
                    relative w-4 h-4 rounded-full border-2 transition-all duration-300
                    ${
                      index === activeIndex
                        ? 'border-transparent shadow-lg'
                        : 'border-border bg-background hover:border-primary/50'
                    }
                  `}
                  style={{
                    backgroundColor: index === activeIndex ? item.color : undefined,
                    boxShadow: index === activeIndex ? `0 0 20px ${item.color}40` : undefined,
                  }}
                  animate={{
                    scale: index === activeIndex ? 1.5 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`
                      absolute inset-0 flex items-center justify-center text-xs
                      ${index === activeIndex ? 'text-white' : 'text-foreground-muted'}
                    `}
                    animate={{
                      scale: index === activeIndex ? 0.7 : 0.6,
                    }}
                  >
                    {getIcon(item.icon)}
                  </motion.div>
                </motion.div>

                {/* Year Label */}
                <motion.div
                  className={`
                    absolute top-8 text-sm font-medium transition-colors duration-300
                    ${index === activeIndex ? 'text-foreground' : 'text-foreground-muted'}
                  `}
                  animate={{
                    y: index === activeIndex ? 8 : 0,
                    scale: index === activeIndex ? 1.1 : 1,
                  }}
                >
                  {item.year}
                </motion.div>

                {/* Hover Card */}
                <AnimatePresence>
                  {index === activeIndex && (
                    <motion.div
                      className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div
                        className="bg-card border border-border rounded-lg p-4 shadow-xl max-w-xs"
                        style={{ borderColor: `${item.color}40` }}
                      >
                        {/* Arrow */}
                        <div
                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
                          style={{ backgroundColor: 'hsl(var(--card))' }}
                        />

                        {/* Content */}
                        <h3 className="font-semibold text-sm mb-2" style={{ color: item.color }}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-foreground-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(items.indexOf(item))}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${
                    items.indexOf(item) === activeIndex
                      ? 'bg-primary scale-125'
                      : 'bg-border hover:bg-primary/50'
                  }
                `}
                aria-label={`Go to timeline item: ${item.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
