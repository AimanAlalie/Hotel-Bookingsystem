import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isAdmin, forbiddenResponse, unauthorizedResponse } from '@/lib/auth'

// GET /api/hotels/[id] - Get a single hotel
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/hotels/[id] - Update a hotel (admin only)
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
  const { name, name_en, name_ar, city, description, description_en, description_ar, image_url } = body

  console.log('Updating hotel:', id)
  console.log('Body received:', { name, name_en, name_ar, city, description, description_en, description_ar, image_url })

  const { data, error } = await supabase
    .from('hotels')
    .update({ name, name_en, name_ar, city, description, description_en, description_ar, image_url })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('Update successful:', data)

  return NextResponse.json(data)
}

// DELETE /api/hotels/[id] - Delete a hotel (admin only)
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
    .from('hotels')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
