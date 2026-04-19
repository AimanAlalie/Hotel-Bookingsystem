import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendBookingConfirmation } from '@/lib/email'
import { isAdmin, forbiddenResponse } from '@/lib/auth'

// GET /api/bookings - Get bookings (user's own or all for admin)
export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  const all = searchParams.get('all') === 'true'

  const { data: { user } } = await supabase.auth.getUser()

  // If requesting all bookings, require admin privileges
  if (all) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!isAdmin(user)) {
      return forbiddenResponse()
    }
  }

  let query = supabase
    .from('bookings')
    .select(`
      *,
      rooms (
        id,
        name,
        price,
        hotels (
          id,
          name,
          city
        )
      )
    `)
    .order('created_at', { ascending: false })

  // If requesting all bookings (admin), don't filter by user
  // Otherwise filter by current user or specified user_id
  if (!all) {
    if (userId) {
      query = query.eq('user_id', userId)
    } else if (user) {
      query = query.eq('user_id', user.id)
    }
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/bookings - Create a new booking
export async function POST(request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { room_id, firstname, lastname, email, check_in, check_out } = body

  if (!room_id || !firstname || !lastname || !email || !check_in || !check_out) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (check_out <= check_in) {
    return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
  }

  const { data: conflicts, error: conflictError } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', room_id)
    .lt('check_in', check_out)
    .gt('check_out', check_in)

  if (conflictError) {
    return NextResponse.json({ error: 'Could not check availability' }, { status: 500 })
  }

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({ error: 'Room is not available for selected dates' }, { status: 409 })
  }

  // Create booking
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      room_id,
      user_id: user?.id || null,
      firstname,
      lastname,
      email,
      check_in,
      check_out
    }])
    .select(`
      *,
      rooms (
        id,
        name,
        price,
        hotels (
          id,
          name,
          city
        )
      )
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send confirmation email (fire-and-forget)
  const nights = Math.round(
    (new Date(data.check_out) - new Date(data.check_in)) / (1000 * 60 * 60 * 24)
  )
  const totalPrice = nights * (data.rooms?.price || 0)

  sendBookingConfirmation({
    to: data.email,
    guestName: `${data.firstname} ${data.lastname}`,
    hotelName: data.rooms?.hotels?.name || '',
    roomName: data.rooms?.name || '',
    pricePerNight: data.rooms?.price || 0,
    checkIn: data.check_in,
    checkOut: data.check_out,
    totalPrice,
  }).catch((err) => console.error('Failed to send booking email:', err))

  return NextResponse.json(data, { status: 201 })
}
