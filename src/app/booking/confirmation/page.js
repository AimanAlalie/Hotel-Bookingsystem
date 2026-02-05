'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BookingConfirmationPage() {
  const router = useRouter()
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
        <p>Laden...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '60px', marginBottom: '20px', color: '#28a745' }}>
        ✓
      </div>

      <h1 style={{ color: '#28a745' }}>Buchung erfolgreich!</h1>

      <p>Vielen Dank, {booking.firstname} {booking.lastname}.</p>
      <p>Eine Bestätigung wurde an <strong>{booking.email}</strong> gesendet.</p>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '400px',
        margin: '30px auto',
        textAlign: 'left'
      }}>
        <h3 style={{ marginTop: '0' }}>Buchungsdetails</h3>
        <p><strong>Hotel:</strong> {booking.hotel.name}</p>
        <p><strong>Stadt:</strong> {booking.hotel.city}</p>
        <p><strong>Zimmer:</strong> {booking.room.name}</p>
        <p><strong>Preis:</strong> {booking.room.price} € pro Nacht</p>
        <p><strong>Check-in:</strong> {booking.checkIn}</p>
        <p><strong>Check-out:</strong> {booking.checkOut}</p>
      </div>

      <Link href="/" className="btn btn-primary">
        Zurück zur Startseite
      </Link>
    </div>
  )
}
