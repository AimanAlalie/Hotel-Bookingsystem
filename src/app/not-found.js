'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
        {t('notFound.backToHome')}
      </Link>
    </div>
  )
}
