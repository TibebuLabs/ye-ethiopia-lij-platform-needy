import axios, { AxiosInstance } from 'axios'

const BASE_URL: string = (typeof import.meta !== 'undefined' && (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) || '/api'

const api: AxiosInstance = axios.create({ baseURL: BASE_URL })

// Separate instance for refresh — bypasses the response interceptor
const refreshApi = axios.create({ baseURL: BASE_URL })

let isRefreshing = false
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
  failedQueue = []
}

api.interceptors.request.use((config) => {
  // Skip adding token for refresh endpoint to avoid infinite loop
  if (config.url?.includes('/accounts/login/refresh/')) {
    return config
  }

  const token = localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
  
  // Only add token if it exists and is not null/undefined/empty
  if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Handle FormData properly
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  
  return config
})

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.includes('/media/')) return path.slice(path.indexOf('/media/'))
  return `/media/${path.replace(/^\/+/, '')}`
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    
    // If no response or no config, just reject
    if (!error.response || !original) {
      return Promise.reject(error)
    }
    
    // If it's not a 401 or already retried, reject
    if (error.response.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Mark as retried to prevent infinite loops
    original._retry = true

    // Get refresh token and validate it's not null/undefined/empty
    let refresh = localStorage.getItem('refresh_token') ?? sessionStorage.getItem('refresh_token')
    
    // IMPORTANT: Check if refresh token exists and is valid
    if (!refresh || refresh === 'null' || refresh === 'undefined' || refresh.trim() === '') {
      console.warn('No valid refresh token found, redirecting to login')
      localStorage.clear()
      sessionStorage.clear()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      }).catch(err => Promise.reject(err))
    }

    isRefreshing = true
    
    try {
      // Send the refresh token - ensure it's a valid string
      const payload = { refresh: refresh }
      console.log('Sending refresh request...') // Debug
      
      const { data } = await refreshApi.post('/accounts/login/refresh/', payload)
      
      // Validate response has access token
      if (!data || !data.access) {
        throw new Error('No access token in response')
      }
      
      // Determine which storage to use (prefer localStorage if refresh token was there)
      const storage = localStorage.getItem('refresh_token') ? localStorage : sessionStorage
      
      // Store the new access token
      storage.setItem('access_token', data.access)
      console.log('New access token stored successfully')
      
      // Only update refresh token if backend sends a new one and it's valid
      if (data.refresh && data.refresh !== 'null' && data.refresh !== 'undefined' && data.refresh.trim() !== '') {
        storage.setItem('refresh_token', data.refresh)
        console.log('New refresh token stored successfully')
      }
      
      // Update the original request with new token
      original.headers.Authorization = `Bearer ${data.access}`
      
      // Process any queued requests
      processQueue(null, data.access)
      
      // Retry the original request
      return api(original)
      
    } catch (refreshError: any) {
      console.error('Refresh failed:', refreshError.response?.data || refreshError.message)
      
      // Process queue with error
      processQueue(new Error('refresh_failed'), null)
      
      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      
      return Promise.reject(refreshError)
      
    } finally {
      isRefreshing = false
    }
  }
)

export default api