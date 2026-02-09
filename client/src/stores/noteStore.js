import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useAuthStore } from './authStore'

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// Custom storage that uses user-specific key
const createUserStorage = (baseName) => ({
    getItem: (name) => {
        const user = useAuthStore.getState().user
        const userId = user?.id || user?.googleId || 'anonymous'
        const key = `${baseName}-${userId}`
        const value = localStorage.getItem(key)
        return value
    },
    setItem: (name, value) => {
        const user = useAuthStore.getState().user
        const userId = user?.id || user?.googleId || 'anonymous'
        const key = `${baseName}-${userId}`
        localStorage.setItem(key, value)
    },
    removeItem: (name) => {
        const user = useAuthStore.getState().user
        const userId = user?.id || user?.googleId || 'anonymous'
        const key = `${baseName}-${userId}`
        localStorage.removeItem(key)
    },
})

export const useNoteStore = create(
    persist(
        (set, get) => ({
            notes: [],
            folders: [
                { id: 'personal', name: 'ส่วนตัว', icon: '📝', color: '#6366f1' },
                { id: 'work', name: 'งาน', icon: '💼', color: '#f59e0b' },
                { id: 'ideas', name: 'ไอเดีย', icon: '💡', color: '#10b981' },
                { id: 'archive', name: 'เก็บถาวร', icon: '📦', color: '#64748b' }
            ],
            activeNote: null,
            searchQuery: '',

            createNote: (data = {}) => {
                const newNote = {
                    id: generateId(),
                    title: data.title || 'Untitled',
                    content: data.content || null,
                    folder: data.folder || null,
                    tags: data.tags || [],
                    color: data.color || null,
                    isPinned: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                set((state) => ({
                    notes: [newNote, ...state.notes],
                    activeNote: newNote.id
                }))
                return newNote
            },

            updateNote: (id, updates) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id
                            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                            : note
                    )
                }))
            },

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                    activeNote: state.activeNote === id ? null : state.activeNote
                }))
            },

            duplicateNote: (id) => {
                const { notes, createNote } = get()
                const note = notes.find((n) => n.id === id)
                if (note) {
                    return createNote({
                        title: `${note.title} (สำเนา)`,
                        content: note.content,
                        folder: note.folder,
                        tags: note.tags
                    })
                }
            },

            togglePin: (id) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, isPinned: !note.isPinned } : note
                    )
                }))
            },

            createFolder: (name, icon = '📁', color = '#6366f1') => {
                const newFolder = { id: generateId(), name, icon, color }
                set((state) => ({ folders: [...state.folders, newFolder] }))
                return newFolder
            },

            updateFolder: (id, updates) => {
                set((state) => ({
                    folders: state.folders.map((folder) =>
                        folder.id === id ? { ...folder, ...updates } : folder
                    )
                }))
            },

            deleteFolder: (id) => {
                set((state) => ({
                    folders: state.folders.filter((folder) => folder.id !== id),
                    notes: state.notes.map((note) =>
                        note.folder === id ? { ...note, folder: null } : note
                    )
                }))
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
            setActiveNote: (id) => set({ activeNote: id }),

            getFilteredNotes: (folderId = null) => {
                const { notes, searchQuery } = get()
                let filtered = notes

                if (folderId) {
                    filtered = filtered.filter((note) => note.folder === folderId)
                }

                if (searchQuery) {
                    const query = searchQuery.toLowerCase()
                    filtered = filtered.filter(
                        (note) =>
                            note.title?.toLowerCase().includes(query) ||
                            (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(query)))
                    )
                }

                return filtered.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1
                    if (!a.isPinned && b.isPinned) return 1
                    return new Date(b.updatedAt) - new Date(a.updatedAt)
                })
            },

            getNoteById: (id) => {
                const { notes } = get()
                return notes.find((note) => note.id === id)
            },

            // Clear notes when user changes
            clearNotes: () => set({ notes: [], activeNote: null })
        }),
        {
            name: 'webnote-notes',
            storage: createJSONStorage(() => createUserStorage('webnote-notes'))
        }
    )
)
