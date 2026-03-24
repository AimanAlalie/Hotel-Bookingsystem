'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function CheckoutChoicePage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← {t('booking.back')}
      </Link>

      <h2>{t('checkoutChoice.title')}</h2>
      <p>{t('checkoutChoice.subtitle')}</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        <button
          onClick={() => router.push('/login?redirect=/booking')}
          className="btn btn-primary"
        >
          {t('checkoutChoice.login')}
        </button>

        <button
          onClick={() => router.push('/register?redirect=/booking')}
          className="btn btn-success"
        >
          {t('checkoutChoice.register')}
        </button>

        <button
          onClick={() => router.push('/booking')}
          className="btn btn-secondary"
        >
          {t('checkoutChoice.continueAsGuest')}
        </button>
      </div>
    </div>
  )
}
