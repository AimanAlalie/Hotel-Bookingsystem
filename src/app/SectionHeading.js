'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function SectionHeading({ labelKey, titleKey, subtitleKey }) {
  const { t } = useLanguage()

  return (
    <div className="text-center mb-12">
      <p className="section-label">{t(labelKey)}</p>
      <h2 className="section-heading">{t(titleKey)}</h2>
      <p className="section-subtitle mx-auto">
        {t(subtitleKey)}
      </p>
    </div>
  )
}
