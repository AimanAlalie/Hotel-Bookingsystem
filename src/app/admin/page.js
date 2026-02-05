'use client'

import { useEffect, useState } from 'react'
import styles from './admin.module.css'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AdminDashboard() {
  const { t, language } = useLanguage()
  const [hotelCount, setHotelCount] = useState(0)
  const [roomCount, setRoomCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [hotelsRes, roomsRes, bookingsRes] = await Promise.all([
          fetch('/api/hotels'),
          fetch('/api/rooms'),
          fetch('/api/bookings?all=true'),
        ])

        const hotels = await hotelsRes.json()
        const rooms = await roomsRes.json()
        const bookings = await bookingsRes.json()

        setHotelCount(Array.isArray(hotels) ? hotels.length : 0)
        setRoomCount(Array.isArray(rooms) ? rooms.length : 0)
        setBookingCount(Array.isArray(bookings) ? bookings.length : 0)
        setRecentBookings(Array.isArray(bookings) ? bookings.slice(0, 5) : [])
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const locale = language === 'ar' ? 'ar-SA' : 'en-US'

  if (loading) {
    return <p>{t('admin.loading')}</p>
  }

  return (
    <div>
      <h1>{t('admin.dashboard')}</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{hotelCount}</h3>
          <p>{t('admin.hotels')}</p>
        </div>
        <div className={styles.statCard}>
          <h3>{roomCount}</h3>
          <p>{t('admin.rooms')}</p>
        </div>
        <div className={styles.statCard}>
          <h3>{bookingCount}</h3>
          <p>{t('admin.bookings')}</p>
        </div>
      </div>

      <h2>{t('admin.recentBookings')}</h2>

      {recentBookings.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>{t('admin.guest')}</th>
              <th>{t('admin.hotel')}</th>
              <th>{t('admin.room')}</th>
              <th>{t('admin.checkIn')}</th>
              <th>{t('admin.checkOut')}</th>
              <th>{t('admin.bookedOn')}</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.firstname} {booking.lastname}</td>
                <td>{booking.rooms?.hotels?.name || '-'}</td>
                <td>{booking.rooms?.name || '-'}</td>
                <td>{booking.check_in}</td>
                <td>{booking.check_out}</td>
                <td>{new Date(booking.created_at).toLocaleDateString(locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t('admin.noBookings')}</p>
      )}
    </div>
  )
}
