import { useEffect, useState } from 'react';

interface LanguageSelectorProps {
  currentLocale: string;
}

/**
 * Language selector component
 * Switches between available languages
 */
export function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  const changeLanguage = (locale: string) => {
    const currentPath = window.location.pathname;
    // Remove existing locale prefix (en or es)
    const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '');

    // Add new locale prefix
    const newPath = `/${locale}${pathWithoutLocale || '/'}`;

    window.location.href = newPath;
  };

  if (!mounted) {
    return (
      <div className="language-selector p-2 rounded-lg bg-muted">
        <div className="w-12 h-5" />
      </div>
    );
  }

  return (
    <div className="language-selector flex gap-1 p-1 rounded-lg bg-muted">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentLocale === lang.code
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
