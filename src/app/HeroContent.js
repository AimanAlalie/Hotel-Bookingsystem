'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import HeroSearch from './HeroSearch'
import StatsRow from './StatsRow'

export default function HeroContent({ cities, hotelCount, cityCount }) {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-charcoal">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
          {t('home.heroTitle')}
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {t('home.heroSubtitle')}
        </p>

        {/* Search bar */}
        <HeroSearch cities={cities} />

        {/* Stats */}
        <div className="mt-16">
          <StatsRow hotelCount={hotelCount} cityCount={cityCount} />
        </div>
      </div>
    </section>
  )
}
