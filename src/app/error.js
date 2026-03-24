'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Error({ error, reset }) {
  const { t } = useLanguage()

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>{t('error.title')}</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {error?.message || t('error.message')}
      </p>
      <button onClick={() => reset()} className="btn btn-primary">
        {t('error.retry')}
      </button>
    </div>
  )
}
