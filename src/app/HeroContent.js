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
          backgroundImage:
            "url('https://images.unsplash.com/photo-1611907671216-7ec6ef949163?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
