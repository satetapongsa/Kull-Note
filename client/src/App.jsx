import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import Layout from './components/Layout/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import NoteEditor from './pages/NoteEditor'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import { useEffect, useRef } from 'react'

function App() {
    const { user, checkAuth, loading } = useAuthStore()
    const { theme } = useThemeStore()
    const prevUserId = useRef(null)

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    // Track user changes and reload only when user actually changes (not on initial load)
    useEffect(() => {
        const currentUserId = user?.id || user?.googleId || null

        // If we had a previous user and now we have a different user, reload
        if (prevUserId.current !== null && prevUserId.current !== currentUserId && currentUserId !== null) {
            window.location.reload()
        }

        prevUserId.current = currentUserId
    }, [user?.id, user?.googleId])

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>กำลังโหลด...</p>
            </div>
        )
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'var(--surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--surface-border)',
                    }
                }}
            />
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
                <Route element={user ? <Layout /> : <Navigate to="/" />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/notes/:id" element={<NoteEditor />} />
                    <Route path="/notes/new" element={<NoteEditor />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App
