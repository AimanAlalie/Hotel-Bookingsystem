'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben.')
      return
    }

    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if (authError) {
      setError('Registrierung fehlgeschlagen. ' + authError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <Link href="/" className="back-link">
          ← Zurück
        </Link>

        <h1 style={{ color: '#28a745' }}>Registrierung erfolgreich!</h1>
        <p>Bitte überprüfen Sie Ihre Email und klicken Sie auf den Bestätigungslink.</p>

        <p style={{ marginTop: '20px' }}>
          <Link
            href={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
            style={{ color: '#007bff' }}
          >
            Zum Login
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <Link href="/" className="back-link">
        ← Zurück
      </Link>

      <h1>Registrieren</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleRegister}>
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

        <div className="form-group">
          <label>Passwort bestätigen:</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-success"
          style={{ width: '100%' }}
        >
          {loading ? 'Wird geladen...' : 'Registrieren'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Bereits ein Konto?{' '}
        <Link
          href={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
          style={{ color: '#007bff' }}
        >
          Jetzt anmelden
        </Link>
      </p>
    </div>
  )
}
