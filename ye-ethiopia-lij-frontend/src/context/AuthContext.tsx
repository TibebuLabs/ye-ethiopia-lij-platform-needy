import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  // On mount: verify the stored token is still valid by checking it exists
  // If tokens are missing but user object exists, clear everything
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user') ?? sessionStorage.getItem('user')
    if (storedUser && !accessToken) {
      // User data exists but no token — stale state, clear it
      localStorage.clear()
      sessionStorage.clear()
      setUser(null)
    }
  }, [])

  const login = async (email: string, password: string, remember = true): Promise<User> => {
    setLoading(true)
    try {
      const { data } = await apiLogin({ email, password })
      const storage = remember ? localStorage : sessionStorage
      storage.setItem('access_token', data.access)
      storage.setItem('refresh_token', data.refresh)
      storage.setItem('user', JSON.stringify(data.user))
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
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
