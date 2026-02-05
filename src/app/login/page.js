'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (authError) {
      setError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.')
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <Link href="/" className="back-link">
        ← Zurück
      </Link>

      <h1>Anmelden</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Passwort:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Wird geladen...' : 'Anmelden'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Noch kein Konto?{' '}
        <Link
          href={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
          style={{ color: '#007bff' }}
        >
          Jetzt registrieren
        </Link>
      </p>
    </div>
  )
}
