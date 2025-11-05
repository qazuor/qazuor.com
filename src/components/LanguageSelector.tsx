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
      <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
        <div className="w-12 h-5" />
      </div>
    );
  }

  return (
    <div className="flex gap-1 p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentLocale === lang.code
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
