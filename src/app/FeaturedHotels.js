'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function FeaturedHotels({ hotels }) {
  const { t, language } = useLanguage()

  // Helper function to get localized hotel name
  const getHotelName = (hotel) => {
    return language === 'ar' && hotel.name_ar ? hotel.name_ar : (hotel.name_en || hotel.name)
  }

  if (!hotels || hotels.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <Link href={`/hotel/${hotel.id}`} key={hotel.id} className="group">
          <div className="card transition-transform duration-300 group-hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              {hotel.image_url ? (
                <Image
                  src={hotel.image_url}
                  alt={getHotelName(hotel)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              {/* City */}
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-brand text-sm font-medium">{hotel.city}</span>
              </div>

              {/* Hotel name */}
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-3 line-clamp-1">{getHotelName(hotel)}</h3>

              {/* Amenity icons */}
              <div className="flex items-center gap-4 mb-4 text-gray-400">
                <div className="flex items-center gap-1" title={t('home.wifi')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                  </svg>
                  <span className="text-xs">{t('home.wifi')}</span>
                </div>
                <div className="flex items-center gap-1" title={t('home.breakfast')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">{t('home.breakfast')}</span>
                </div>
                <div className="flex items-center gap-1" title={t('home.parking')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs">{t('home.parking')}</span>
                </div>
              </div>

              {/* Price + View Details */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  {hotel.min_price ? (
                    <span className="text-gray-900 font-bold text-lg">
                      {t('common.currencySymbol')}{hotel.min_price}
                      <span className="text-gray-400 text-sm font-normal"> {t('home.perNight')}</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">&nbsp;</span>
                  )}
                </div>
                <span className="text-brand font-semibold text-sm group-hover:underline">
                  {t('home.viewDetails')} &rarr;
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
