import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isAdmin, forbiddenResponse, unauthorizedResponse } from '@/lib/auth'

// GET /api/rooms/[id] - Get a single room
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      hotels (
        id,
        name,
        city,
        description
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/rooms/[id] - Update a room (admin only)
export async function PUT(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return unauthorizedResponse()
  }
  if (!isAdmin(user)) {
    return forbiddenResponse()
  }

  const body = await request.json()
  const { hotel_id, name, price, capacity, image_url } = body

  const { data, error } = await supabase
    .from('rooms')
    .update({ hotel_id, name, price, capacity, image_url })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/rooms/[id] - Delete a room (admin only)
export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return unauthorizedResponse()
  }
  if (!isAdmin(user)) {
    return forbiddenResponse()
  }

  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
