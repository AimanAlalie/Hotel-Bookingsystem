import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isAdmin, forbiddenResponse, unauthorizedResponse } from '@/lib/auth'

// GET /api/hotels - Get all hotels
export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  let query = supabase.from('hotels').select('*')

  if (city && city !== 'Alle') {
    query = query.eq('city', city)
  }

  const { data, error } = await query.order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/hotels - Create a new hotel (admin only)
export async function POST(request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return unauthorizedResponse()
  }
  if (!isAdmin(user)) {
    return forbiddenResponse()
  }

  const body = await request.json()
  const { name, city, description, image_url } = body

  if (!name || !city) {
    return NextResponse.json({ error: 'Name and city are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('hotels')
    .insert([{ name, city, description, image_url }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
