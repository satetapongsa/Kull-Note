import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultColors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#22d3ee',
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8'
}

const lightColors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#22d3ee',
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569'
}

export const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'dark',
            colors: defaultColors,
            fontSize: 16,
            sidebarCollapsed: false,

            toggleTheme: () => {
                const { theme } = get()
                const newTheme = theme === 'dark' ? 'light' : 'dark'
                const newColors = newTheme === 'dark' ? defaultColors : lightColors
                set({ theme: newTheme, colors: newColors })
                applyColors(newColors)
            },

            setTheme: (theme) => {
                const newColors = theme === 'dark' ? defaultColors : lightColors
                set({ theme, colors: newColors })
                applyColors(newColors)
            },

            setColor: (key, value) => {
                const { colors } = get()
                const newColors = { ...colors, [key]: value }
                set({ colors: newColors })
                applyColors(newColors)
            },

            setColors: (newColors) => {
                const { colors } = get()
                const merged = { ...colors, ...newColors }
                set({ colors: merged })
                applyColors(merged)
            },

            setFontSize: (size) => {
                set({ fontSize: size })
                document.documentElement.style.fontSize = `${size}px`
            },

            toggleSidebar: () => {
                const { sidebarCollapsed } = get()
                set({ sidebarCollapsed: !sidebarCollapsed })
            },

            resetTheme: () => {
                set({ theme: 'dark', colors: defaultColors, fontSize: 16 })
                applyColors(defaultColors)
                document.documentElement.style.fontSize = '16px'
            }
        }),
        {
            name: 'webnote-theme',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyColors(state.colors)
                    document.documentElement.style.fontSize = `${state.fontSize}px`
                }
            }
        }
    )
)

function applyColors(colors) {
    const root = document.documentElement
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--secondary', colors.secondary)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--bg-primary', colors.bgPrimary)
    root.style.setProperty('--bg-secondary', colors.bgSecondary)
    root.style.setProperty('--text-primary', colors.textPrimary)
    root.style.setProperty('--text-secondary', colors.textSecondary)
}
