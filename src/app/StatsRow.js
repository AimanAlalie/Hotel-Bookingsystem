'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function StatsRow({ hotelCount, cityCount }) {
  const { t } = useLanguage()

  const stats = [
    { value: `${hotelCount}+`, label: t('home.statHotels') },
    { value: `${cityCount}+`, label: t('home.statCities') },
    { value: '2K+', label: t('home.statGuests') },
    { value: '4.9', label: t('home.statRating') },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white font-heading">{stat.value}</div>
          <div className="text-white/60 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
