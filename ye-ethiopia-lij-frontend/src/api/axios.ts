import axios, { AxiosInstance } from 'axios'

const BASE_URL: string = (import.meta.env.VITE_API_URL as string) || '/api'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
})

// Flag to prevent multiple refresh requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  // Don't add token for refresh endpoint
  if (config.url?.includes('/accounts/login/refresh/')) {
    return config
  }

  const token = localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (config.data instanceof FormData) {
    // Let the browser set Content-Type with the correct multipart boundary.
    // Must delete from all possible locations axios stores it.
    delete config.headers['Content-Type']
    delete config.headers.common?.['Content-Type']
    delete config.headers.post?.['Content-Type']
    delete config.headers.put?.['Content-Type']
    delete config.headers.patch?.['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

/** Convert a Django media URL to a Vite-proxied path */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.includes('/media/')) return path.slice(path.indexOf('/media/'))
  return `/media/${path.replace(/^\/+/, '')}`
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    
    // Prevent infinite loop on refresh endpoint
    if (original?.url?.includes('/accounts/login/refresh/')) {
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue this request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            original.headers.Authorization = `Bearer ${token}`
            return api(original)
          })
          .catch(err => Promise.reject(err))
      }
      
      original._retry = true
      isRefreshing = true
      
      const refresh = localStorage.getItem('refresh_token') ?? sessionStorage.getItem('refresh_token')
      
      if (!refresh) {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/login'
        isRefreshing = false
        return Promise.reject(error)
      }
      
      try {
        // Create a temporary axios instance for refresh to avoid interceptor loop
        const { data } = await axios.create({ baseURL: BASE_URL }).post('/accounts/login/refresh/', { refresh })
        const storage = localStorage.getItem('refresh_token') ? localStorage : sessionStorage
        storage.setItem('access_token', data.access as string)
        // Save new refresh token if backend returns it
        if (data.refresh) {
          storage.setItem('refresh_token', data.refresh as string)
        }
        original.headers.Authorization = `Bearer ${data.access as string}`
        
        // Process queued requests
        processQueue(null, data.access)
        
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError as Error, null)
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api