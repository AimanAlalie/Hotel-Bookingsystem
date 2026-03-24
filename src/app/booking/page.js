'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function BookingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()

  const [hotel, setHotel] = useState(null)
  const [room, setRoom] = useState(null)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedHotel = sessionStorage.getItem('selectedHotel')
    const storedRoom = sessionStorage.getItem('selectedRoom')

    if (!storedHotel || !storedRoom) {
      router.push('/')
      return
    }

    setHotel(JSON.parse(storedHotel))
    setRoom(JSON.parse(storedRoom))
  }, [router])

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  async function handleBooking() {
    if (loading) return

    setError('')

    if (!firstname || !lastname || !email || !checkIn || !checkOut) {
      setError(t('booking.fillAllFields'))
      return
    }

    if (checkOut <= checkIn) {
      setError(t('booking.checkOutAfterCheckIn'))
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: room.id,
          firstname,
          lastname,
          email,
          check_in: checkIn,
          check_out: checkOut
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setError(t('booking.roomNotAvailable'))
        } else {
          setError(data.error || t('booking.bookingFailed'))
        }
        return
      }

      // Store booking data for confirmation page
      sessionStorage.setItem('bookingData', JSON.stringify({
        firstname,
        lastname,
        email,
        checkIn,
        checkOut,
        room,
        hotel
      }))

      // Clear selection
      sessionStorage.removeItem('selectedHotel')
      sessionStorage.removeItem('selectedRoom')

      router.push('/booking/confirmation')
    } catch (err) {
      setError(t('booking.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  if (!hotel || !room) {
    return (
      <div className="container">
        <p>{t('booking.loading')}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <Link href={`/hotel/${hotel.id}`} className="back-link">
        ← {t('booking.back')}
      </Link>

      <h1>{t('booking.title')}</h1>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <p><strong>{t('booking.hotel')}:</strong> {hotel.name}</p>
        <p><strong>{t('booking.room')}:</strong> {room.name}</p>
        <p><strong>{t('booking.price')}:</strong> {room.price} € {t('hotel.perNight')}</p>
      </div>

      <h2>{t('booking.yourDetails')}</h2>

      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>{t('booking.firstName')}:</label>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>{t('booking.lastName')}:</label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>{t('booking.email')}:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || !!user}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>{t('booking.checkIn')}:</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>{t('booking.checkOut')}:</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={loading}
        className="btn btn-success"
        style={{ marginTop: '10px' }}
      >
        {loading ? t('booking.pleaseWait') : t('booking.bookNow')}
      </button>
    </div>
  )
}
