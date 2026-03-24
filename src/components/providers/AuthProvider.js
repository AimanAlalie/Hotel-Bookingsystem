'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

function checkIsAdmin(user) {
  if (!user?.email) return false
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(e => e.length > 0)
  return adminEmails.includes(user.email)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = checkIsAdmin(user)

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
