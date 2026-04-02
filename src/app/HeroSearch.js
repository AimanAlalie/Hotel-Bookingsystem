'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function HeroSearch({ cities }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  // Get min checkout date (day after check-in, or today if no check-in)
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today

  const handleSearch = (e) => {
    e.preventDefault()

    // Build query params
    const params = new URLSearchParams()
    if (destination) params.set('city', destination)
    if (checkIn) params.set('check_in', checkIn)
    if (checkOut) params.set('check_out', checkOut)
    if (guests) params.set('guests', guests === '5+' ? '5' : guests)

    // Navigate to search results page
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-xl p-3 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
      {/* Destination */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs text-gray-500 font-medium mb-1 px-2">{t('home.searchDestination')}</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
        >
          <option value="">{t('home.anyDestination')}</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Check-in */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs text-gray-500 font-medium mb-1 px-2">{t('home.searchCheckIn')}</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value)
            // Reset checkout if it's before or equal to new check-in
            if (checkOut && checkOut <= e.target.value) {
              setCheckOut('')
            }
          }}
          min={today}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
        />
      </div>

      {/* Check-out */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs text-gray-500 font-medium mb-1 px-2">{t('home.searchCheckOut')}</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={minCheckOut}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
        />
      </div>

      {/* Guests */}
      <div className="w-full md:w-28">
        <label className="block text-xs text-gray-500 font-medium mb-1 px-2">{t('home.searchGuests')}</label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </select>
      </div>

      {/* Search button */}
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full md:w-auto bg-brand hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
        >
          {t('home.searchButton')}
        </button>
      </div>
    </form>
  )
}
