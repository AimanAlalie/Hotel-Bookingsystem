import { NextResponse } from 'next/server'

/**
 * Check if a user is an admin based on their email
 * @param {Object} user - The user object from Supabase auth
 * @returns {boolean} - True if user is admin, false otherwise
 */
export function isAdmin(user) {
  if (!user?.email) return false

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(e => e.length > 0)

  return adminEmails.includes(user.email)
}

/**
 * Return a 403 Forbidden response for non-admin users
 * @returns {NextResponse} - 403 Forbidden response
 */
export function forbiddenResponse() {
  return NextResponse.json(
    { error: 'Forbidden - Admins only' },
    { status: 403 }
  )
}

/**
 * Return a 401 Unauthorized response for unauthenticated users
 * @returns {NextResponse} - 401 Unauthorized response
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}
