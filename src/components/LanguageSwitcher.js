'use client'

import { useLanguage } from './providers/LanguageProvider'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'en'
            ? 'bg-white text-gray-800 font-semibold'
            : 'text-white/80 hover:text-white'
        }`}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <span className="text-white/50">|</span>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'ar'
            ? 'bg-white text-gray-800 font-semibold'
            : 'text-white/80 hover:text-white'
        }`}
        aria-label="التبديل إلى العربية"
        aria-pressed={language === 'ar'}
      >
        عربي
      </button>
    </div>
  )
}
