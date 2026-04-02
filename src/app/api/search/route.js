import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/search - Search for available rooms
export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const city = searchParams.get('city')
  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')
  const guests = parseInt(searchParams.get('guests')) || 1

  // Build base query for rooms with hotel info
  let query = supabase
    .from('rooms')
    .select(`
      id,
      name,
      name_ar,
      price,
      capacity,
      image_url,
      hotels (
        id,
        name,
        name_ar,
        city,
        description,
        description_ar,
        image_url
      )
    `)
    .gte('capacity', guests)
    .order('price', { ascending: true })

  // Filter by city if provided
  if (city) {
    query = query.eq('hotels.city', city)
  }

  const { data: rooms, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter out rooms where hotel is null (happens when city filter doesn't match)
  let availableRooms = rooms.filter(room => room.hotels !== null)

  // If dates are provided, filter out rooms with conflicting bookings
  if (checkIn && checkOut) {
    // Get all room IDs that have conflicting bookings
    const { data: conflicts, error: conflictError } = await supabase
      .from('bookings')
      .select('room_id')
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    if (conflictError) {
      return NextResponse.json({ error: 'Could not check availability' }, { status: 500 })
    }

    const bookedRoomIds = new Set(conflicts.map(c => c.room_id))
    availableRooms = availableRooms.filter(room => !bookedRoomIds.has(room.id))
  }

  // Group rooms by hotel for better display
  const hotelMap = new Map()

  for (const room of availableRooms) {
    const hotelId = room.hotels.id
    if (!hotelMap.has(hotelId)) {
      hotelMap.set(hotelId, {
        ...room.hotels,
        rooms: []
      })
    }
    hotelMap.get(hotelId).rooms.push({
      id: room.id,
      name: room.name,
      name_ar: room.name_ar,
      price: room.price,
      capacity: room.capacity,
      image_url: room.image_url
    })
  }

  const results = Array.from(hotelMap.values())

  return NextResponse.json({
    hotels: results,
    totalRooms: availableRooms.length,
    filters: {
      city: city || null,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      guests
    }
  })
}
