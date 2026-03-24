'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const { t, language } = useLanguage()
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
        setError(t('myBookings.errorLoading'))
        setBookings([])
      } else {
        setBookings(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      setError(t('myBookings.errorOccurred'))
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
      setError(t('myBookings.fillCheckInOut'))
      return
    }
    if (editCheckOut <= editCheckIn) {
      setError(t('myBookings.checkOutAfterCheckIn'))
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
        setError(t('myBookings.updateFailed'))
        return
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, check_in: editCheckIn, check_out: editCheckOut } : b
        )
      )

      cancelEdit()
    } catch (err) {
      setError(t('myBookings.errorOccurred'))
    } finally {
      setSaving(false)
    }
  }

  async function cancelBooking(bookingId) {
    const ok = window.confirm(t('myBookings.confirmCancel'))
    if (!ok) return

    setError('')
    setSaving(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        setError(t('myBookings.cancelFailed'))
        return
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId))

      if (editingId === bookingId) {
        cancelEdit()
      }
    } catch (err) {
      setError(t('myBookings.errorOccurred'))
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container">
        <p>{t('myBookings.loadingBookings')}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← {t('myBookings.backToHome')}
      </Link>

      <h1>{t('myBookings.title')}</h1>

      {error && <p className="error">{error}</p>}

      {bookings.length === 0 ? (
        <p>{t('myBookings.noBookings')}</p>
      ) : (
        bookings.map((booking) => {
          const hotelName = booking.rooms?.hotels?.name || 'Hotel'
          const city = booking.rooms?.hotels?.city || '-'
          const roomName = booking.rooms?.name || '-'
          const price = booking.rooms?.price ?? null

          const nights = calcNights(booking.check_in, booking.check_out)
          const total = nights && typeof price === 'number' ? nights * price : null

          const createdAtText = booking.created_at
            ? new Date(booking.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'de-DE')
            : null

          const isEditing = editingId === booking.id

          return (
            <div key={booking.id} className="card p-5 mb-4">
              <h3>{hotelName}</h3>
              <p><strong>{t('myBookings.city')}:</strong> {city}</p>
              <p><strong>{t('myBookings.room')}:</strong> {roomName}</p>
              <p><strong>{t('myBookings.price')}:</strong> {price ?? '-'} € {t('myBookings.perNight')}</p>

              {!isEditing ? (
                <>
                  <p><strong>{t('myBookings.checkIn')}:</strong> {booking.check_in}</p>
                  <p><strong>{t('myBookings.checkOut')}:</strong> {booking.check_out}</p>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>
                      <strong>{t('myBookings.checkIn')}</strong>
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
                      <strong>{t('myBookings.checkOut')}</strong>
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

              {nights && <p><strong>{t('myBookings.nights')}:</strong> {nights}</p>}
              {total !== null && <p><strong>{t('myBookings.totalPrice')}:</strong> {total} €</p>}

              {createdAtText && (
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {t('myBookings.bookedOn')}: {createdAtText}
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
                      {t('myBookings.edit')}
                    </button>

                    <button
                      onClick={() => cancelBooking(booking.id)}
                      disabled={saving}
                      className="btn btn-danger"
                    >
                      {t('myBookings.cancel')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveEdit(booking.id)}
                      disabled={saving}
                      className="btn btn-success"
                    >
                      {saving ? t('myBookings.saving') : t('myBookings.save')}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="btn btn-secondary"
                    >
                      {t('myBookings.cancelEdit')}
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
