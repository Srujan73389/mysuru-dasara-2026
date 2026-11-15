import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { refreshToken, login, logout } = useAuthStore.getState()
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/auth/token/refresh/`,
            { refresh: refreshToken }
          )
          const newToken = res.data.access
          login(newToken, refreshToken, useAuthStore.getState().user!)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch {
          logout()
        }
      } else {
        logout()
      }
    }
    return Promise.reject(error)
  }
)

// ─── Events API ───────────────────────────────────────────────
export const eventsAPI = {
  getEvents: (params?: Record<string, unknown>) => api.get('/api/events/', { params }),
  getEvent: (id: string) => api.get(`/api/events/${id}/`),
  saveEvent: (id: string) => api.post(`/api/events/${id}/save/`),
  unsaveEvent: (id: string) => api.delete(`/api/events/${id}/save/`),
}

// ─── Venues API ───────────────────────────────────────────────
export const venuesAPI = {
  getVenues: () => api.get('/api/venues/'),
  getVenue: (id: string) => api.get(`/api/venues/${id}/`),
}

// ─── Tourism API ──────────────────────────────────────────────
export const tourismAPI = {
  getLandmarks: (params?: Record<string, unknown>) => api.get('/api/landmarks/', { params }),
  getLandmark: (id: string) => api.get(`/api/landmarks/${id}/`),
}

// ─── Heritage API ─────────────────────────────────────────────
export const heritageAPI = {
  getExhibits: () => api.get('/api/heritage/exhibits/'),
  getExhibit: (id: string) => api.get(`/api/heritage/exhibits/${id}/`),
}

// ─── Achievements API ─────────────────────────────────────────
export const achievementsAPI = {
  getAchievements: () => api.get('/api/achievements/'),
  getUserAchievements: () => api.get('/api/achievements/user/'),
}

// ─── Announcements API ────────────────────────────────────────
export const announcementsAPI = {
  getAnnouncements: () => api.get('/api/announcements/'),
}

// ─── Itineraries API ──────────────────────────────────────────
export const itinerariesAPI = {
  getItineraries: () => api.get('/api/itineraries/'),
  createItinerary: (data: unknown) => api.post('/api/itineraries/', data),
  updateItinerary: (id: string, data: unknown) => api.put(`/api/itineraries/${id}/`, data),
  deleteItinerary: (id: string) => api.delete(`/api/itineraries/${id}/`),
}

// ─── AI API ───────────────────────────────────────────────────
export const aiAPI = {
  sendMessage: (message: string, language: string, sessionId: string) =>
    api.post('/api/ai/chat/', { message, language, session_id: sessionId }),
}

// ─── Auth API ─────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login/', { email, password }),
  register: (data: unknown) => api.post('/api/auth/register/', data),
  getProfile: () => api.get('/api/auth/profile/'),
  updateProfile: (data: unknown) => api.put('/api/auth/profile/', data),
}

// ─── Festival API ─────────────────────────────────────────────
export const festivalAPI = {
  getInfo: () => api.get('/api/festival/info/'),
}

export default api
