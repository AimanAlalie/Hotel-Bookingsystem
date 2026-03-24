'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './providers/AuthProvider'
import { useLanguage } from './providers/LanguageProvider'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, isAdmin: userIsAdmin, signOut } = useAuth()
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  // Don't show public nav on admin pages
  if (isAdmin) return null

  const navBg = isHome && !scrolled
    ? 'bg-black/20 backdrop-blur-sm'
    : 'bg-charcoal shadow-lg'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 rtl:flex-row-reverse">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-brand text-2xl font-bold font-heading">Y</span>
            <span className="text-white text-xl font-bold tracking-tight">YemenStay</span>
          </Link>

          {/* Center links - desktop */}
          <div className="hidden md:flex items-center gap-8 rtl:flex-row-reverse">
            <Link
              href="/#destinations"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              {t('nav.destinations')}
            </Link>
            <Link
              href="/#hotels"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              {t('nav.hotels')}
            </Link>
            <Link
              href="/#about"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              {t('nav.about')}
            </Link>
          </div>

          {/* Right side - desktop */}
          <div className="hidden md:flex items-center gap-4 rtl:flex-row-reverse">
            <LanguageSwitcher />

            {!loading && (
              <>
                {user ? (
                  <>
                    {userIsAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-1.5 text-brand hover:text-brand-400 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t('nav.admin')}
                      </Link>
                    )}
                    <Link
                      href="/my-bookings"
                      className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                    >
                      {t('nav.myBookings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-white/80 hover:text-white transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                  >
                    {t('nav.signIn')}
                  </Link>
                )}
              </>
            )}

            <Link
              href="/#hotels"
              className="bg-brand hover:bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {t('nav.bookNow')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white bg-transparent border-none cursor-pointer p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-charcoal border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link href="/#destinations" className="block text-white/80 hover:text-white text-sm font-medium py-1">
              {t('nav.destinations')}
            </Link>
            <Link href="/#hotels" className="block text-white/80 hover:text-white text-sm font-medium py-1">
              {t('nav.hotels')}
            </Link>
            <Link href="/#about" className="block text-white/80 hover:text-white text-sm font-medium py-1">
              {t('nav.about')}
            </Link>

            <div className="border-t border-white/10 pt-3">
              {!loading && (
                <>
                  {user ? (
                    <>
                      {userIsAdmin && (
                        <Link href="/admin" className="flex items-center gap-1.5 text-brand hover:text-brand-400 text-sm font-medium py-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t('nav.admin')}
                        </Link>
                      )}
                      <Link href="/my-bookings" className="block text-white/80 hover:text-white text-sm font-medium py-1">
                        {t('nav.myBookings')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block text-white/80 hover:text-white text-sm font-medium py-1 bg-transparent border-none cursor-pointer p-0"
                      >
                        {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="block text-white/80 hover:text-white text-sm font-medium py-1">
                      {t('nav.signIn')}
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <LanguageSwitcher />
              <Link
                href="/#hotels"
                className="bg-brand hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {t('nav.bookNow')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
