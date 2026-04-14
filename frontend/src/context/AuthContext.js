import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearToken, getStoredToken, storeToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const syncUser = async () => {
    const existingToken = getStoredToken()
    if (!existingToken) {
      setLoading(false)
      return
    }

    try {
      const { data } = await api.get('/api/v1/auth/me')
      setUser(data)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    syncUser()
  }, [])

  const login = async (username, password) => {
    const { data } = await api.post('/api/v1/auth/login', { username, password })
    storeToken(data.access_token)
    const me = await api.get('/api/v1/auth/me')
    setUser(me.data)
    return me.data
  }

  const register = async (payload) => {
    await api.post('/api/v1/auth/register', payload)
    return login(payload.username, payload.password)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser: syncUser, setUser }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}