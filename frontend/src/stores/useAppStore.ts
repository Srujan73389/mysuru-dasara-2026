import { create } from 'zustand'

interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
}

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface AppState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  clearUser: () => void

  language: 'en' | 'kn'
  setLanguage: (lang: 'en' | 'kn') => void

  isLoading: boolean
  setLoading: (loading: boolean) => void

  audioEnabled: boolean
  toggleAudio: () => void

  graphicsQuality: 'high' | 'balanced' | 'low'
  setGraphicsQuality: (quality: 'high' | 'balanced' | 'low') => void

  savedEvents: string[]
  toggleSavedEvent: (eventId: string) => void

  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  language: 'en',
  setLanguage: (language) => set({ language }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  audioEnabled: false,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

  graphicsQuality: 'balanced',
  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),

  savedEvents: [],
  toggleSavedEvent: (eventId) =>
    set((state) => ({
      savedEvents: state.savedEvents.includes(eventId)
        ? state.savedEvents.filter((id) => id !== eventId)
        : [...state.savedEvents, eventId],
    })),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now().toString() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
