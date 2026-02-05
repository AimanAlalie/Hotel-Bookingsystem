import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/rooms - Get rooms, optionally filtered by hotel_id
export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const hotelId = searchParams.get('hotel_id')

  let query = supabase.from('rooms').select(`
    *,
    hotels (
      id,
      name,
      city
    )
  `)

  if (hotelId) {
    query = query.eq('hotel_id', hotelId)
  }

  const { data, error } = await query.order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/rooms - Create a new room (admin only)
export async function POST(request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { hotel_id, name, price, capacity, image_url } = body

  if (!hotel_id || !name || price === undefined) {
    return NextResponse.json({ error: 'hotel_id, name, and price are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert([{ hotel_id, name, price, capacity, image_url }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
