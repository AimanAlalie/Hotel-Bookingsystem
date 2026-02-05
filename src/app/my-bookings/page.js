'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editCheckIn, setEditCheckIn] = useState('')
  const [editCheckOut, setEditCheckOut] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    fetchBookings()
  }, [user, authLoading])

  async function fetchBookings() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()

      if (!response.ok) {
        setError('Buchungen konnten nicht geladen werden.')
        setBookings([])
      } else {
        setBookings(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  function calcNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null
    const a = new Date(checkIn)
    const b = new Date(checkOut)
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
    const diff = b.getTime() - a.getTime()
    const nights = Math.round(diff / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : null
  }

  function startEdit(booking) {
    setError('')
    setEditingId(booking.id)
    setEditCheckIn(booking.check_in || '')
    setEditCheckOut(booking.check_out || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditCheckIn('')
    setEditCheckOut('')
  }

  async function saveEdit(bookingId) {
    setError('')

    if (!editCheckIn || !editCheckOut) {
      setError('Bitte Check-in und Check-out ausfüllen.')
      return
    }
    if (editCheckOut <= editCheckIn) {
      setError('Check-out muss nach Check-in sein.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          check_in: editCheckIn,
          check_out: editCheckOut
        })
      })

      if (!response.ok) {
        setError('Änderung fehlgeschlagen.')
        return
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, check_in: editCheckIn, check_out: editCheckOut } : b
        )
      )

      cancelEdit()
    } catch (err) {
      setError('Ein Fehler ist aufgetreten.')
    } finally {
      setSaving(false)
    }
  }

  async function cancelBooking(bookingId) {
    const ok = window.confirm('Möchten Sie diese Buchung wirklich stornieren?')
    if (!ok) return

    setError('')
    setSaving(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        setError('Stornierung fehlgeschlagen.')
        return
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId))

      if (editingId === bookingId) {
        cancelEdit()
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container">
        <p>Buchungen werden geladen...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← Zurück zur Startseite
      </Link>

      <h1>Meine Buchungen</h1>

      {error && <p className="error">{error}</p>}

      {bookings.length === 0 ? (
        <p>Sie haben noch keine Buchungen.</p>
      ) : (
        bookings.map((booking) => {
          const hotelName = booking.rooms?.hotels?.name || 'Hotel'
          const city = booking.rooms?.hotels?.city || '-'
          const roomName = booking.rooms?.name || '-'
          const price = booking.rooms?.price ?? null

          const nights = calcNights(booking.check_in, booking.check_out)
          const total = nights && typeof price === 'number' ? nights * price : null

          const createdAtText = booking.created_at
            ? new Date(booking.created_at).toLocaleDateString('de-DE')
            : null

          const isEditing = editingId === booking.id

          return (
            <div key={booking.id} className="card p-5 mb-4">
              <h3>{hotelName}</h3>
              <p><strong>Stadt:</strong> {city}</p>
              <p><strong>Zimmer:</strong> {roomName}</p>
              <p><strong>Preis:</strong> {price ?? '-'} € pro Nacht</p>

              {!isEditing ? (
                <>
                  <p><strong>Check-in:</strong> {booking.check_in}</p>
                  <p><strong>Check-out:</strong> {booking.check_out}</p>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>
                      <strong>Check-in</strong>
                    </label>
                    <input
                      type="date"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      style={{ padding: 8, width: 200 }}
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>
                      <strong>Check-out</strong>
                    </label>
                    <input
                      type="date"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      style={{ padding: 8, width: 200 }}
                      disabled={saving}
                    />
                  </div>
                </div>
              )}

              {nights && <p><strong>Nächte:</strong> {nights}</p>}
              {total !== null && <p><strong>Gesamtpreis:</strong> {total} €</p>}

              {createdAtText && (
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Gebucht am: {createdAtText}
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => startEdit(booking)}
                      disabled={saving}
                      className="btn btn-secondary"
                    >
                      Ändern
                    </button>

                    <button
                      onClick={() => cancelBooking(booking.id)}
                      disabled={saving}
                      className="btn btn-danger"
                    >
                      Stornieren
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveEdit(booking.id)}
                      disabled={saving}
                      className="btn btn-success"
                    >
                      {saving ? 'Speichert...' : 'Speichern'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="btn btn-secondary"
                    >
                      Abbrechen
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
