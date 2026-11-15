import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  user: UserProfile | null
  login: (token: string, refreshToken: string, user: UserProfile) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      login: (token, refreshToken, user) =>
        set({ token, refreshToken, isAuthenticated: true, user }),
      logout: () =>
        set({ token: null, refreshToken: null, isAuthenticated: false, user: null }),
    }),
    {
      name: 'dasara-auth',
    }
  )
)
