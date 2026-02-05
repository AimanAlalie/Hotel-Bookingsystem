'use client'

import { useEffect, useState } from 'react'
import styles from '../admin.module.css'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AdminHotelsPage() {
  const { t } = useLanguage()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [formData, setFormData] = useState({ name: '', city: '', description: '', image_url: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHotels()
  }, [])

  async function fetchHotels() {
    setLoading(true)
    try {
      const res = await fetch('/api/hotels')
      const data = await res.json()
      setHotels(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(t('admin.errorLoadingHotels'))
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setEditingHotel(null)
    setFormData({ name: '', city: '', description: '', image_url: '' })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  function openEditModal(hotel) {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name || '',
      city: hotel.city || '',
      description: hotel.description || '',
      image_url: hotel.image_url || ''
    })
    setImageFile(null)
    setImagePreview(hotel.image_url || null)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingHotel(null)
    setFormData({ name: '', city: '', description: '', image_url: '' })
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
        uploadData.append('bucket', 'hotel-images')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json()
          imageUrl = uploadResult.url
        }
      }

      const url = editingHotel ? `/api/hotels/${editingHotel.id}` : '/api/hotels'
      const method = editingHotel ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image_url: imageUrl })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('admin.errorSaving'))
        return
      }

      fetchHotels()
      closeModal()
    } catch (err) {
      setError(t('admin.errorOccurred'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('admin.confirmDeleteHotel'))) return

    try {
      const res = await fetch(`/api/hotels/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setHotels((prev) => prev.filter((h) => h.id !== id))
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
        <h1>{t('admin.manageHotels')}</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          + {t('admin.newHotel')}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>{t('admin.name')}</th>
            <th>{t('admin.city')}</th>
            <th>{t('admin.description')}</th>
            <th>{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.city}</td>
              <td>{hotel.description?.substring(0, 50)}...</td>
              <td className={styles.actions}>
                <button onClick={() => openEditModal(hotel)} className="btn btn-secondary">
                  {t('admin.edit')}
                </button>
                <button onClick={() => handleDelete(hotel.id)} className="btn btn-danger">
                  {t('admin.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hotels.length === 0 && <p>{t('admin.noHotels')}</p>}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingHotel ? t('admin.editHotel') : t('admin.createHotel')}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('admin.name')}:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.city')}:</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.description')}:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
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
