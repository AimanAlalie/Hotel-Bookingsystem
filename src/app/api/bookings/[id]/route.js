import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/bookings/[id] - Get a single booking
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
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
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/bookings/[id] - Update a booking
export async function PUT(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { check_in, check_out, firstname, lastname, email } = body

  if (check_out && check_in && check_out <= check_in) {
    return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
  }

  const updateData = {}
  if (check_in) updateData.check_in = check_in
  if (check_out) updateData.check_out = check_out
  if (firstname) updateData.firstname = firstname
  if (lastname) updateData.lastname = lastname
  if (email) updateData.email = email

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/bookings/[id] - Cancel/delete a booking
export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
