'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function SearchResults({ searchParams }) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter state (initialized from URL params)
  const [city, setCity] = useState(searchParams?.city || '')
  const [checkIn, setCheckIn] = useState(searchParams?.check_in || '')
  const [checkOut, setCheckOut] = useState(searchParams?.check_out || '')
  const [guests, setGuests] = useState(searchParams?.guests || '2')

  // Cities for filter dropdown
  const cities = ["Sana'a", "Aden", "Taiz", "Mukalla"]

  // Today and min checkout for date inputs
  const today = new Date().toISOString().split('T')[0]
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today

  // Fetch results when component mounts
  useEffect(() => {
    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchResults = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (city) params.set('city', city)
      if (checkIn) params.set('check_in', checkIn)
      if (checkOut) params.set('check_out', checkOut)
      if (guests) params.set('guests', guests === '5+' ? '5' : guests)

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results')
      }

      setResults(data)
      
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (e) => {
    e.preventDefault()

    // Update URL with new filters
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (checkIn) params.set('check_in', checkIn)
    if (checkOut) params.set('check_out', checkOut)
    if (guests) params.set('guests', guests)

    router.push(`/search?${params.toString()}`)
    fetchResults()
  }

  const handleBookRoom = (room, hotel) => {
    // Store hotel and room for booking page
    sessionStorage.setItem('selectedHotel', JSON.stringify(hotel))
    sessionStorage.setItem('selectedRoom', JSON.stringify(room))

    // Store search dates for pre-filling booking form
    if (checkIn && checkOut) {
      sessionStorage.setItem('searchCheckIn', checkIn)
      sessionStorage.setItem('searchCheckOut', checkOut)
    }

    // Navigate to booking flow (checkout-choice for guests, booking for logged in users)
    router.push('/booking/checkout-choice')
  }

  // Calculate nights and total price
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.round((end - start) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-charcoal py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-white/70 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('hotel.backToOverview')}
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-4">
            {t('search.title')}
          </h1>
          {results && (
            <p className="text-white/70 mt-2">
              {t('search.foundRooms', { count: results.totalRooms })}
            </p>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-3">
            {/* City */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-gray-500 font-medium mb-1">{t('home.searchDestination')}</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
              >
                <option value="">{t('home.anyDestination')}</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Check-in */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-gray-500 font-medium mb-1">{t('home.searchCheckIn')}</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value)
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
              <label className="block text-xs text-gray-500 font-medium mb-1">{t('home.searchCheckOut')}</label>
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
              <label className="block text-xs text-gray-500 font-medium mb-1">{t('home.searchGuests')}</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Update button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto bg-brand hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
              >
                {t('search.updateResults')}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : results?.hotels?.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('search.noResults')}</h3>
              <p className="text-gray-500">{t('search.tryDifferentFilters')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {results?.hotels?.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Hotel header */}
                  <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-gray-900">
                          {language === 'ar' && hotel.name_ar ? hotel.name_ar : hotel.name}
                        </h2>
                        <div className="flex items-center gap-1 mt-1 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{hotel.city}</span>
                        </div>
                      </div>
                      <Link
                        href={`/hotel/${hotel.id}`}
                        className="text-brand hover:text-brand-600 text-sm font-medium"
                      >
                        {t('home.viewDetails')}
                      </Link>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="divide-y">
                    {hotel.rooms.map((room) => (
                      <div key={room.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                        {/* Room image */}
                        <div className="relative w-full md:w-40 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {room.image_url ? (
                            <Image
                              src={room.image_url}
                              alt={room.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Room info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {language === 'ar' && room.name_ar ? room.name_ar : room.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {t('search.upToGuests', { count: room.capacity })}
                            </span>
                          </div>
                        </div>

                        {/* Price and book */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {t('common.currencySymbol')}{room.price}
                            </div>
                            <div className="text-sm text-gray-500">{t('home.perNight')}</div>
                            {nights > 0 && (
                              <div className="text-sm text-brand font-medium mt-1">
                                {t('search.totalFor', { nights })} {t('common.currencySymbol')}{(room.price * nights).toFixed(0)}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleBookRoom(room, hotel)}
                            className="bg-brand hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
                          >
                            {t('hotel.bookNow')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
