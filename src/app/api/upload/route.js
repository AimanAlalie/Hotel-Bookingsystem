import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const bucket = formData.get('bucket')

  if (!file || !bucket) {
    return NextResponse.json({ error: 'File and bucket are required' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 5MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return NextResponse.json({ url: urlData.publicUrl })
}
