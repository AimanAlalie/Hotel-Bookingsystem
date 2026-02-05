'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutChoicePage() {
  const router = useRouter()

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← Zurück
      </Link>

      <h2>Wie möchten Sie fortfahren?</h2>
      <p>Sie können sich anmelden oder als Gast buchen.</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        <button
          onClick={() => router.push('/login?redirect=/booking')}
          className="btn btn-primary"
        >
          Anmelden
        </button>

        <button
          onClick={() => router.push('/register?redirect=/booking')}
          className="btn btn-success"
        >
          Registrieren
        </button>

        <button
          onClick={() => router.push('/booking')}
          className="btn btn-secondary"
        >
          Als Gast fortfahren
        </button>
      </div>
    </div>
  )
}
