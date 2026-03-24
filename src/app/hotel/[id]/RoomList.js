'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/components/providers/AuthProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function RoomList({ rooms, hotel }) {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()

  // Helper function to get localized room name
  const getRoomName = (room) => {
    return language === 'ar' && room.name_ar ? room.name_ar : (room.name_en || room.name)
  }

  const handleSelectRoom = (room) => {
    sessionStorage.setItem('selectedHotel', JSON.stringify(hotel))
    sessionStorage.setItem('selectedRoom', JSON.stringify(room))

    if (user) {
      router.push('/booking')
    } else {
      router.push('/booking/checkout-choice')
    }
  }

  if (rooms.length === 0) {
    return <p className="text-gray-500">{t('hotel.noRooms')}</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="card">
          {/* Room image */}
          <div className="relative h-48 overflow-hidden">
            {room.image_url ? (
              <Image
                src={room.image_url}
                alt={getRoomName(room)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
          </div>

          {/* Room content */}
          <div className="p-5">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">{getRoomName(room)}</h3>

            {/* Info row */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{room.capacity} {t('hotel.persons')}</span>
              </div>
            </div>

            {/* Price + Book button */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-gray-900 font-bold text-xl">{t('common.currencySymbol')}{room.price}</span>
                <span className="text-gray-400 text-sm"> / {t('hotel.perNight')}</span>
              </div>
              <button
                onClick={() => handleSelectRoom(room)}
                className="bg-brand hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {t('hotel.bookNow')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
