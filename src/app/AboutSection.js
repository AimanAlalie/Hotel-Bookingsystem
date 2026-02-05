'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AboutSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('home.aboutLocalExpertise'),
      desc: t('home.aboutLocalExpertiseDesc'),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('home.aboutBestPrices'),
      desc: t('home.aboutBestPricesDesc'),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: t('home.aboutSupport'),
      desc: t('home.aboutSupportDesc'),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <div key={i} className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 text-brand mb-4">
            {feature.icon}
          </div>
          <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  )
}
