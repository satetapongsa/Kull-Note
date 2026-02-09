import { create } from 'zustand'

import { persist } from 'zustand/middleware'
import axios from 'axios'

// For demo mode (when backend is not running)
const DEMO_USER = {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: null
}

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            loading: true,
            isDemo: false,

            checkAuth: async () => {
                try {
                    const response = await axios.get('/auth/me')
                    set({ user: response.data.user, loading: false, isDemo: false })
                } catch (error) {
                    // If backend not available, check if demo mode
                    const state = get()
                    if (state.isDemo && state.user) {
                        set({ loading: false })
                    } else {
                        set({ user: null, loading: false })
                    }
                }
            },

            loginWithGoogle: () => {
                window.location.href = '/auth/google'
            },

            loginDemo: () => {
                set({ user: DEMO_USER, loading: false, isDemo: true })
            },

            logout: async () => {
                try {
                    await axios.post('/auth/logout')
                } catch (error) {
                    // Ignore error if backend not running
                }
                set({ user: null, isDemo: false })
            },

            updateProfile: (updates) => {
                const { user } = get()
                if (user) {
                    set({ user: { ...user, ...updates } })
                }
            }
        }),
        {
            name: 'webnote-auth',
            partialize: (state) => ({
                user: state.isDemo ? state.user : null,
                isDemo: state.isDemo
            })
        }
    )
)
