'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export default function BookingPage() {
  const router = useRouter()
  const { user } = useAuth()

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
      setError('Bitte füllen Sie alle Felder aus.')
      return
    }

    if (checkOut <= checkIn) {
      setError('Check-out muss nach Check-in sein.')
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
          setError('Dieses Zimmer ist im gewählten Zeitraum leider nicht verfügbar.')
        } else {
          setError(data.error || 'Buchung fehlgeschlagen.')
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
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (!hotel || !room) {
    return (
      <div className="container">
        <p>Laden...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <Link href={`/hotel/${hotel.id}`} className="back-link">
        ← Zurück
      </Link>

      <h1>Buchung</h1>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <p><strong>Hotel:</strong> {hotel.name}</p>
        <p><strong>Zimmer:</strong> {room.name}</p>
        <p><strong>Preis:</strong> {room.price} € pro Nacht</p>
      </div>

      <h2>Ihre Daten</h2>

      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>Vorname:</label>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>Nachname:</label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || !!user}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>Check-in:</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          disabled={loading}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="form-group">
        <label>Check-out:</label>
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
        {loading ? 'Bitte warten...' : 'Jetzt buchen'}
      </button>
    </div>
  )
}
