import { createContext, useContext, useState, ReactNode } from 'react'
import { login as apiLogin } from '../api/auth'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string, remember?: boolean) => Promise<User>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user') ?? sessionStorage.getItem('user')
      if (!stored) return null
      const accessToken = localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
      if (!accessToken) return null
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string, remember = true): Promise<User> => {
    setLoading(true)
    try {
      const { data } = await apiLogin({ email, password })
      const storage = remember ? localStorage : sessionStorage
      const other = remember ? sessionStorage : localStorage
      // Save to chosen storage first, then clear the other
      storage.setItem('access_token', data.access)
      storage.setItem('refresh_token', data.refresh)
      storage.setItem('user', JSON.stringify(data.user))
      other.clear()
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}