'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { t } = useLanguage()

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
      setError(t('auth.loginFailed'))
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <Link href="/" className="back-link">
        ← {t('auth.back')}
      </Link>

      <h1>{t('auth.login')}</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
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

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? t('auth.loading') : t('auth.loginButton')}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {t('auth.noAccount')}{' '}
        <Link
          href={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
          style={{ color: '#007bff' }}
        >
          {t('auth.registerNow')}
        </Link>
      </p>
    </div>
  )
}
