'use client'

import { useEffect, useState } from 'react'
import styles from '../admin.module.css'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AdminRoomsPage() {
  const { t } = useLanguage()
  const [rooms, setRooms] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({ hotel_id: '', name: '', price: '', capacity: '', image_url: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([fetchRooms(), fetchHotels()])
  }, [])

  async function fetchRooms() {
    try {
      const res = await fetch('/api/rooms')
      const data = await res.json()
      setRooms(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(t('admin.errorLoadingRooms'))
    } finally {
      setLoading(false)
    }
  }

  async function fetchHotels() {
    try {
      const res = await fetch('/api/hotels')
      const data = await res.json()
      setHotels(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load hotels')
    }
  }

  function openCreateModal() {
    setEditingRoom(null)
    setFormData({ hotel_id: hotels[0]?.id || '', name: '', price: '', capacity: '', image_url: '' })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  function openEditModal(room) {
    setEditingRoom(room)
    setFormData({
      hotel_id: room.hotel_id || '',
      name: room.name || '',
      price: room.price?.toString() || '',
      capacity: room.capacity?.toString() || '',
      image_url: room.image_url || ''
    })
    setImageFile(null)
    setImagePreview(room.image_url || null)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingRoom(null)
    setFormData({ hotel_id: '', name: '', price: '', capacity: '', image_url: '' })
    setImageFile(null)
    setImagePreview(null)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let imageUrl = formData.image_url

      // Upload image if a new file was selected
      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('file', imageFile)
        uploadData.append('bucket', 'room-images')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json()
          imageUrl = uploadResult.url
        }
      }

      const url = editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms'
      const method = editingRoom ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity, 10),
          image_url: imageUrl
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('admin.errorSaving'))
        return
      }

      fetchRooms()
      closeModal()
    } catch (err) {
      setError(t('admin.errorOccurred'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('admin.confirmDeleteRoom'))) return

    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r.id !== id))
      } else {
        setError(t('admin.deleteFailed'))
      }
    } catch (err) {
      setError(t('admin.errorOccurred'))
    }
  }

  if (loading) {
    return <p>{t('admin.loading')}</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{t('admin.manageRooms')}</h1>
        <button onClick={openCreateModal} className="btn btn-primary" disabled={hotels.length === 0}>
          + {t('admin.newRoom')}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {hotels.length === 0 && (
        <p className="error">{t('admin.createHotelFirst')}</p>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>{t('admin.name')}</th>
            <th>{t('admin.hotel')}</th>
            <th>{t('admin.pricePerNight')}</th>
            <th>{t('admin.capacity')}</th>
            <th>{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.hotels?.name || '-'}</td>
              <td>{room.price} €</td>
              <td>{room.capacity} {t('admin.persons')}</td>
              <td className={styles.actions}>
                <button onClick={() => openEditModal(room)} className="btn btn-secondary">
                  {t('admin.edit')}
                </button>
                <button onClick={() => handleDelete(room.id)} className="btn btn-danger">
                  {t('admin.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rooms.length === 0 && hotels.length > 0 && <p>{t('admin.noRooms')}</p>}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingRoom ? t('admin.editRoom') : t('admin.createRoom')}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('admin.hotel')}:</label>
                <select
                  value={formData.hotel_id}
                  onChange={(e) => setFormData({ ...formData, hotel_id: e.target.value })}
                  required
                  disabled={saving}
                >
                  <option value="">-- {t('admin.selectHotel')} --</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} ({hotel.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('admin.roomName')}:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.pricePerNight')} (€):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.capacity')} ({t('admin.persons')}):</label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.uploadImage')}:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  disabled={saving}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
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
