'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function ErrorMessage({ messageKey, className = '' }) {
  const { t } = useLanguage()
  return <p className={className}>{t(messageKey)}</p>
}
