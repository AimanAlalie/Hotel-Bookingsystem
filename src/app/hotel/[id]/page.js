import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import HotelContent from './HotelContent'

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

  return <HotelContent hotel={hotel} rooms={rooms} roomsError={roomsError} />
}
