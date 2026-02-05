import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import RoomList from './RoomList'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: hotel } = await supabase
    .from('hotels')
    .select('name, city')
    .eq('id', id)
    .single()

  if (!hotel) {
    return { title: 'Hotel not found' }
  }

  return {
    title: `${hotel.name} - Hotel in ${hotel.city} | YemenStay`,
    description: `Book rooms at ${hotel.name} in ${hotel.city}, Yemen.`,
  }
}

export default async function HotelDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: hotel, error: hotelError } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single()

  if (hotelError || !hotel) {
    notFound()
  }

  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .eq('hotel_id', id)
    .order('name')

  return (
    <>
      {/* Hero header with hotel image */}
      <section className="relative h-[50vh] min-h-[350px] bg-charcoal">
        {hotel.image_url ? (
          <>
            <Image
              src={hotel.image_url}
              alt={hotel.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-gray-800" />
        )}

        {/* Overlay content */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <Link
            href="/"
            className="text-white/70 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition-colors w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to hotels
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-brand font-medium">{hotel.city}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {hotel.name}
          </h1>
        </div>
      </section>

      {/* Hotel details + rooms */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Description */}
          {hotel.description && (
            <div className="mb-12 max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{hotel.description}</p>
            </div>
          )}

          {/* Rooms */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>

            {roomsError ? (
              <p className="error">Failed to load rooms.</p>
            ) : (
              <RoomList rooms={rooms || []} hotel={hotel} />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
