import styles from './admin.module.css'
import AdminSidebar from './AdminSidebar'

export const metadata = {
  title: 'Admin - Hotel Booking System',
}

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
