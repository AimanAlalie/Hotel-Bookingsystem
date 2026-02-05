'use client'

import Link from 'next/link'
import styles from './admin.module.css'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AdminSidebar() {
  const { t } = useLanguage()

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>{t('admin.panel')}</h2>
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.navLink}>
          {t('admin.dashboard')}
        </Link>
        <Link href="/admin/hotels" className={styles.navLink}>
          {t('admin.hotels')}
        </Link>
        <Link href="/admin/rooms" className={styles.navLink}>
          {t('admin.rooms')}
        </Link>
        <Link href="/admin/bookings" className={styles.navLink}>
          {t('admin.bookings')}
        </Link>
      </nav>
      <div className={styles.backLink}>
        <Link href="/">← {t('admin.backToWebsite')}</Link>
      </div>
    </aside>
  )
}
