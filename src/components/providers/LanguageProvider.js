'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

const translations = { en, ar }

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  isRTL: false,
})

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language')
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language)
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }
  }, [language, mounted])

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang)
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
