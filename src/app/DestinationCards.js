'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

const DESTINATION_IMAGES = {
  "Sana'a":
    "https://images.unsplash.com/photo-1668896379676-c349528c9023?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Sanaa:
    "https://images.unsplash.com/photo-1611907671216-7ec6ef949163?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Aden: "https://images.unsplash.com/photo-1755020474967-36501de91d66?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Taiz: "https://images.unsplash.com/photo-1624532144155-62077f290e3b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

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
