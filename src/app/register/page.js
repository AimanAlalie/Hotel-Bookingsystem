'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { t } = useLanguage()

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
      setError(t('auth.passwordMismatch'))
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError(t('auth.passwordMinLength'))
      return
    }

    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if (authError) {
      setError(t('auth.registrationFailed') + ' ' + authError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <Link href="/" className="back-link">
          ← {t('auth.back')}
        </Link>

        <h1 style={{ color: '#28a745' }}>{t('auth.registrationSuccess')}</h1>
        <p>{t('auth.checkEmail')}</p>

        <p style={{ marginTop: '20px' }}>
          <Link
            href={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
            style={{ color: '#007bff' }}
          >
            {t('auth.toLogin')}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <Link href="/" className="back-link">
        ← {t('auth.back')}
      </Link>

      <h1>{t('auth.register')}</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>{t('auth.email')}:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>{t('auth.password')}:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>{t('auth.confirmPassword')}:</label>
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
          {loading ? t('auth.loading') : t('auth.registerButton')}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {t('auth.hasAccount')}{' '}
        <Link
          href={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
          style={{ color: '#007bff' }}
        >
          {t('auth.loginNow')}
        </Link>
      </p>
    </div>
  )
}
