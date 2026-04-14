import axios from 'axios'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: false,
})

function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('derf_access_token')
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function storeToken(token) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('derf_access_token', token)
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('derf_access_token')
  }
}

export function getStoredToken() {
  return getToken()
}