'use client'

import { useEffect, useState, useCallback } from 'react'
import styles from '../admin.module.css'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AdminBookingsPage() {
  const { t } = useLanguage()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    check_in: '',
    check_out: ''
  })
  const [saving, setSaving] = useState(false)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings?all=true')
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch {
      setError(t('admin.errorLoadingBookings'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  function openEditModal(booking) {
    setEditingBooking(booking)
    setFormData({
      firstname: booking.firstname || '',
      lastname: booking.lastname || '',
      email: booking.email || '',
      check_in: booking.check_in || '',
      check_out: booking.check_out || ''
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingBooking(null)
    setFormData({ firstname: '', lastname: '', email: '', check_in: '', check_out: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('admin.errorSaving'))
        return
      }

      fetchBookings()
      closeModal()
    } catch (err) {
      setError(t('admin.errorOccurred'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('admin.confirmDeleteBooking'))) return

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id))
      } else {
        setError(t('admin.deleteFailed'))
      }
    } catch (err) {
      setError(t('admin.errorOccurred'))
    }
  }

  function calcNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null
    const a = new Date(checkIn)
    const b = new Date(checkOut)
    const diff = b.getTime() - a.getTime()
    const nights = Math.round(diff / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : null
  }

  if (loading) {
    return <p>{t('admin.loading')}</p>
  }

  return (
    <div>
      <h1>{t('admin.manageBookings')}</h1>

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>{t('admin.guest')}</th>
            <th>{t('admin.email')}</th>
            <th>{t('admin.hotel')}</th>
            <th>{t('admin.room')}</th>
            <th>{t('admin.checkIn')}</th>
            <th>{t('admin.checkOut')}</th>
            <th>{t('admin.nights')}</th>
            <th>{t('admin.total')}</th>
            <th>{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const nights = calcNights(booking.check_in, booking.check_out)
            const price = booking.rooms?.price
            const total = nights && price ? nights * price : null

            return (
              <tr key={booking.id}>
                <td>{booking.firstname} {booking.lastname}</td>
                <td>{booking.email}</td>
                <td>{booking.rooms?.hotels?.name || '-'}</td>
                <td>{booking.rooms?.name || '-'}</td>
                <td>{booking.check_in}</td>
                <td>{booking.check_out}</td>
                <td>{nights || '-'}</td>
                <td>{total ? `${total} €` : '-'}</td>
                <td className={styles.actions}>
                  <button onClick={() => openEditModal(booking)} className="btn btn-secondary">
                    {t('admin.edit')}
                  </button>
                  <button onClick={() => handleDelete(booking.id)} className="btn btn-danger">
                    {t('admin.delete')}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {bookings.length === 0 && <p>{t('admin.noBookings')}</p>}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{t('admin.editBooking')}</h2>

            <p style={{ color: '#666', marginBottom: '15px' }}>
              <strong>{t('admin.hotel')}:</strong> {editingBooking.rooms?.hotels?.name || '-'}<br />
              <strong>{t('admin.room')}:</strong> {editingBooking.rooms?.name || '-'}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('admin.firstName')}:</label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.lastName')}:</label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.email')}:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.checkIn')}:</label>
                <input
                  type="date"
                  value={formData.check_in}
                  onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.checkOut')}:</label>
                <input
                  type="date"
                  value={formData.check_out}
                  onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={saving}>
                  {t('admin.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
