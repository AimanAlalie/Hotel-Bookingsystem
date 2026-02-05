'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function HotelList({ initialHotels }) {
  const { t } = useLanguage()
  const [selectedCity, setSelectedCity] = useState('Alle')

  const filteredHotels = selectedCity === 'Alle'
    ? initialHotels
    : initialHotels.filter(hotel => hotel.city === selectedCity)

  // Get unique cities
  const cities = ['Alle', ...new Set(initialHotels.map(h => h.city).filter(Boolean))]

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <label>{t('home.selectCity')}: </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          {cities.map(city => (
            <option key={city} value={city}>
              {city === 'Alle' ? t('home.allCities') : city}
            </option>
          ))}
        </select>
      </div>

      {filteredHotels.length === 0 ? (
        <p>{t('home.noHotels')}</p>
      ) : (
        filteredHotels.map((hotel) => (
          <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
            <div className="card" style={{ cursor: 'pointer' }}>
              {hotel.image_url ? (
                <div style={{ marginBottom: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                  <Image
                    src={hotel.image_url}
                    alt={hotel.name}
                    width={600}
                    height={300}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{
                  marginBottom: '10px',
                  height: '200px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#adb5bd'
                }}>
                  {t('admin.noImage')}
                </div>
              )}
              <h3 style={{ margin: '0 0 10px 0' }}>{hotel.name}</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>{t('home.city')}:</strong> {hotel.city}
              </p>
              <p style={{ margin: '5px 0' }}>{hotel.description}</p>
              <p style={{ color: '#007bff', marginTop: '10px' }}>
                {t('home.clickForRooms')} →
              </p>
            </div>
          </Link>
        ))
      )}
    </>
  )
}
