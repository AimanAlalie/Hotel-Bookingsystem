'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

const DESTINATION_IMAGES = {
  "Sana'a": 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&h=400&fit=crop',
  "Sanaa": 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&h=400&fit=crop',
  "Aden": 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&h=400&fit=crop',
  "Taiz": 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&h=400&fit=crop',
}

export default function DestinationCards({ destinations }) {
  const { t } = useLanguage()

  if (!destinations || destinations.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {destinations.map((dest) => (
        <a
          key={dest.city}
          href="#hotels"
          className="group relative rounded-xl overflow-hidden h-64 block"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            {DESTINATION_IMAGES[dest.city] ? (
              <Image
                src={DESTINATION_IMAGES[dest.city]}
                alt={dest.city}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand/30 to-brand/60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Text overlay */}
          <div className="relative h-full flex flex-col justify-end p-5">
            <h3 className="text-white font-heading text-xl font-bold mb-1">{dest.city}</h3>
            <p className="text-white/70 text-sm">
              {dest.count} {t('home.hotelsIn')}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
