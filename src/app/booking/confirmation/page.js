'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function BookingConfirmationPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData')
    if (!data) {
      router.push('/')
      return
    }
    setBooking(JSON.parse(data))
    sessionStorage.removeItem('bookingData')
  }, [router])

  if (!booking) {
    return (
      <div className="container">
        <p>{t('booking.loading')}</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '60px', marginBottom: '20px', color: '#28a745' }}>
        ✓
      </div>

      <h1 style={{ color: '#28a745' }}>{t('confirmation.title')}</h1>

      <p>{t('confirmation.thankYou')}, {booking.firstname} {booking.lastname}.</p>
      <p>{t('confirmation.confirmationSent')} <strong>{booking.email}</strong>.</p>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '400px',
        margin: '30px auto',
        textAlign: 'left'
      }}>
        <h3 style={{ marginTop: '0' }}>{t('confirmation.bookingDetails')}</h3>
        <p><strong>{t('confirmation.hotel')}:</strong> {booking.hotel.name}</p>
        <p><strong>{t('confirmation.city')}:</strong> {booking.hotel.city}</p>
        <p><strong>{t('confirmation.room')}:</strong> {booking.room.name}</p>
        <p><strong>{t('confirmation.price')}:</strong> {booking.room.price} € {t('confirmation.perNight')}</p>
        <p><strong>{t('confirmation.checkIn')}:</strong> {booking.checkIn}</p>
        <p><strong>{t('confirmation.checkOut')}:</strong> {booking.checkOut}</p>
      </div>

      <Link href="/" className="btn btn-primary">
        {t('confirmation.backToHome')}
      </Link>
    </div>
  )
}
