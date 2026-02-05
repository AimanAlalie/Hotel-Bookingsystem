'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function HeroSearch({ cities }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [destination, setDestination] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Scroll to hotels section, optionally with city filter
    const el = document.getElementById('hotels')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
        />
      </div>

      {/* Check-out */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs text-gray-500 font-medium mb-1 px-2">{t('home.searchCheckOut')}</label>
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
        />
      </div>

      {/* Guests */}
      <div className="w-full md:w-28">
        <label className="block text-xs text-gray-500 font-medium mb-1 px-2">{t('home.searchGuests')}</label>
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5+</option>
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
