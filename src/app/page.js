import { createClient } from '@/lib/supabase/server'
import HeroSearch from './HeroSearch'
import StatsRow from './StatsRow'
import DestinationCards from './DestinationCards'
import FeaturedHotels from './FeaturedHotels'
import AboutSection from './AboutSection'

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

  // Get unique cities with hotel counts
  const cityMap = {}
  allHotels.forEach(h => {
    if (h.city) {
      cityMap[h.city] = (cityMap[h.city] || 0) + 1
    }
  })
  const destinations = Object.entries(cityMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  const cities = [...new Set(allHotels.map(h => h.city).filter(Boolean))]

  return (
    <>
      {/* Hero Section */}
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
            Experience Yemen&apos;s<br />Timeless Beauty
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Book unique stays in Yemen&apos;s most beautiful destinations. From ancient cities to coastal retreats, discover the magic of Arabia Felix.
          </p>

          {/* Search bar */}
          <HeroSearch cities={cities} />

          {/* Stats */}
          <div className="mt-16">
            <StatsRow hotelCount={allHotels.length} cityCount={cities.length} />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label">EXPLORE YEMEN</p>
            <h2 className="section-heading">Popular Destinations</h2>
            <p className="section-subtitle mx-auto">
              Discover the diverse beauty of Yemen, from ancient architectural wonders to stunning coastal landscapes.
            </p>
          </div>

          {destinations.length > 0 ? (
            <DestinationCards destinations={destinations} />
          ) : (
            <p className="text-center text-gray-400">No destinations available yet.</p>
          )}
        </div>
      </section>

      {/* Featured Hotels */}
      <section id="hotels" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label">HANDPICKED FOR YOU</p>
            <h2 className="section-heading">Featured Hotels</h2>
            <p className="section-subtitle mx-auto">
              From boutique heritage hotels to modern luxury resorts, find the perfect stay for your Yemen adventure.
            </p>
          </div>

          {error ? (
            <p className="error text-center">Failed to load hotels.</p>
          ) : (
            <FeaturedHotels hotels={allHotels} />
          )}
        </div>
      </section>

      {/* About / Why Choose Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label">WHY CHOOSE US</p>
            <h2 className="section-heading">Why Choose YemenStay</h2>
            <p className="section-subtitle mx-auto">
              We provide the best travel experience in Yemen
            </p>
          </div>

          <AboutSection />
        </div>
      </section>
    </>
  )
}
