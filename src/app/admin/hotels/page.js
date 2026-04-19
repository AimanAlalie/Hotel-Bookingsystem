'use client'

import { useEffect, useState, useCallback } from 'react'
import styles from '../admin.module.css'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AdminHotelsPage() {
  const { t } = useLanguage()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ar: '',
    city: '',
    description: '',
    description_en: '',
    description_ar: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchHotels = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hotels')
      const data = await res.json()
      setHotels(Array.isArray(data) ? data : [])
    } catch {
      setError(t('admin.errorLoadingHotels'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  function openCreateModal() {
    setEditingHotel(null)
    setFormData({
      name: '',
      name_en: '',
      name_ar: '',
      city: '',
      description: '',
      description_en: '',
      description_ar: '',
      image_url: ''
    })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  function openEditModal(hotel) {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name || '',
      name_en: hotel.name_en || hotel.name || '',
      name_ar: hotel.name_ar || '',
      city: hotel.city || '',
      description: hotel.description || '',
      description_en: hotel.description_en || hotel.description || '',
      description_ar: hotel.description_ar || '',
      image_url: hotel.image_url || ''
    })
    setImageFile(null)
    setImagePreview(hotel.image_url || null)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingHotel(null)
    setFormData({
      name: '',
      name_en: '',
      name_ar: '',
      city: '',
      description: '',
      description_en: '',
      description_ar: '',
      image_url: ''
    })
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

      // Use English name as default name for backwards compatibility
      const dataToSend = {
        ...formData,
        name: formData.name_en || formData.name,
        description: formData.description_en || formData.description,
        image_url: imageUrl
      }

      const url = editingHotel ? `/api/hotels/${editingHotel.id}` : '/api/hotels'
      const method = editingHotel ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
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
              <td>
                {hotel.name_en || hotel.name}
                {hotel.name_ar && <div style={{ fontSize: '12px', color: '#666' }}>{hotel.name_ar}</div>}
              </td>
              <td>{hotel.city}</td>
              <td>{(hotel.description_en || hotel.description)?.substring(0, 50)}...</td>
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
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>{editingHotel ? t('admin.editHotel') : t('admin.createHotel')}</h2>

            <form onSubmit={handleSubmit}>
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

              <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>{t('admin.translations')}</legend>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label>{t('admin.nameEnglish')}:</label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label>{t('admin.nameArabic')}:</label>
                    <input
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      required
                      disabled={saving}
                      dir="rtl"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>{t('admin.descriptionEnglish')}:</label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      rows={3}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>{t('admin.descriptionArabic')}:</label>
                    <textarea
                      value={formData.description_ar}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      rows={3}
                      required
                      disabled={saving}
                      dir="rtl"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="form-group">
                <label>{t('admin.uploadImage')}:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  required={!editingHotel}
                  disabled={saving}
                />
                {imagePreview && (
                  /* eslint-disable-next-line @next/next/no-img-element */
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
