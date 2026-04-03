import { createClient } from '@/lib/supabase/server'
import HeroContent from './HeroContent'
import SectionHeading from './SectionHeading'
import DestinationCards from './DestinationCards'
import FeaturedHotels from './FeaturedHotels'
import AboutSection from './AboutSection'
import ErrorMessage from './ErrorMessage'

export const metadata = {
  title: 'YemenStay - Experience Yemen\'s Timeless Beauty',
  description: 'Book unique stays in Yemen\'s most beautiful destinations. Luxury hotels in Sana\'a, Aden, Taiz and more.',
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch hotels with their minimum room price
  const { data: hotels, error } = await supabase
    .from('hotels')
    .select('*, rooms(price)')
    .order('name')

  const allHotels = (hotels || []).map(hotel => ({
    ...hotel,
    min_price: hotel.rooms && hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map(r => r.price))
      : null,
    rooms: undefined,
  }))

  // Get unique cities with hotel counts (only show top 3 cities)
  const allowedCities = ["Sana'a", "Aden", "Taiz"]
  const cityMap = {}
  allHotels.forEach(h => {
    if (h.city && allowedCities.includes(h.city)) {
      cityMap[h.city] = (cityMap[h.city] || 0) + 1
    }
  })
  const destinations = Object.entries(cityMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const cities = [...new Set(allHotels.map(h => h.city).filter(Boolean))]

  return (
    <>
      {/* Hero Section */}
      <HeroContent cities={cities} hotelCount={allHotels.length} cityCount={cities.length} />

      {/* Popular Destinations */}
      <section id="destinations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            labelKey="home.exploreYemen"
            titleKey="home.popularDestinations"
            subtitleKey="home.popularDestSubtitle"
          />

          {destinations.length > 0 ? (
            <DestinationCards destinations={destinations} />
          ) : (
            <ErrorMessage messageKey="home.noDestinations" className="text-center text-gray-400" />
          )}
        </div>
      </section>

      {/* Featured Hotels */}
      <section id="hotels" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            labelKey="home.handpicked"
            titleKey="home.featuredHotels"
            subtitleKey="home.featuredSubtitle"
          />

          {error ? (
            <ErrorMessage messageKey="home.errorLoadingHotels" className="error text-center" />
          ) : (
            <FeaturedHotels hotels={allHotels} />
          )}
        </div>
      </section>

      {/* About / Why Choose Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            labelKey="home.aboutLabel"
            titleKey="home.aboutTitle"
            subtitleKey="home.aboutSubtitle"
          />

          <AboutSection />
        </div>
      </section>
    </>
  )
}
