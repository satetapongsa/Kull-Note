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

export const useTaskStore = create(
    persist(
        (set, get) => ({
            tasks: [],
            categories: [
                { id: 'general', name: 'ทั่วไป', icon: '📋', color: '#64748b' },
                { id: 'work', name: 'งาน', icon: '💼', color: '#3b82f6' },
                { id: 'personal', name: 'ส่วนตัว', icon: '🏠', color: '#10b981' },
                { id: 'health', name: 'สุขภาพ', icon: '💪', color: '#ef4444' },
                { id: 'learning', name: 'การเรียน', icon: '📚', color: '#8b5cf6' }
            ],
            priorities: [
                { id: 'low', name: 'ต่ำ', color: '#64748b' },
                { id: 'medium', name: 'ปานกลาง', color: '#f59e0b' },
                { id: 'high', name: 'สูง', color: '#ef4444' },
                { id: 'urgent', name: 'เร่งด่วน', color: '#dc2626' }
            ],
            filter: { status: 'all', category: 'all', priority: 'all' },

            createTask: (data) => {
                const newTask = {
                    id: generateId(),
                    title: data.title,
                    description: data.description || '',
                    dueDate: data.dueDate || null,
                    priority: data.priority || 'medium',
                    category: data.category || 'general',
                    tags: data.tags || [],
                    status: 'todo',
                    subtasks: [],
                    createdAt: new Date().toISOString(),
                    completedAt: null
                }
                set((state) => ({ tasks: [newTask, ...state.tasks] }))
                return newTask
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates } : task
                    )
                }))
            },

            deleteTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id)
                }))
            },

            toggleTaskStatus: (id) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? {
                                ...task,
                                status: task.status === 'done' ? 'todo' : 'done',
                                completedAt: task.status === 'done' ? null : new Date().toISOString()
                            }
                            : task
                    )
                }))
            },

            addSubtask: (taskId, title) => {
                const subtask = { id: generateId(), title, done: false }
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, subtasks: [...(task.subtasks || []), subtask] }
                            : task
                    )
                }))
            },

            toggleSubtask: (taskId, subtaskId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                subtasks: (task.subtasks || []).map((st) =>
                                    st.id === subtaskId ? { ...st, done: !st.done } : st
                                )
                            }
                            : task
                    )
                }))
            },

            setFilter: (filterUpdates) => {
                set((state) => ({ filter: { ...state.filter, ...filterUpdates } }))
            },

            getFilteredTasks: () => {
                const { tasks, filter } = get()
                let filtered = tasks

                if (filter.status !== 'all') {
                    filtered = filtered.filter((task) => task.status === filter.status)
                }
                if (filter.category !== 'all') {
                    filtered = filtered.filter((task) => task.category === filter.category)
                }
                if (filter.priority !== 'all') {
                    filtered = filtered.filter((task) => task.priority === filter.priority)
                }

                return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            },

            getTodayTasks: () => {
                const { tasks } = get()
                const today = new Date().toISOString().split('T')[0]
                return tasks.filter((task) => task.dueDate === today && task.status !== 'done')
            },

            getOverdueTasks: () => {
                const { tasks } = get()
                const today = new Date().toISOString().split('T')[0]
                return tasks.filter((task) => task.dueDate && task.dueDate < today && task.status !== 'done')
            },

            getStats: () => {
                const { tasks } = get()
                return {
                    total: tasks.length,
                    completed: tasks.filter((t) => t.status === 'done').length,
                    done: tasks.filter((t) => t.status === 'done').length, // Alias for compatibility
                    todo: tasks.filter((t) => t.status === 'todo').length,
                    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
                    pending: tasks.filter((t) => t.status !== 'done').length,
                    overdue: get().getOverdueTasks().length
                }
            },

            // Clear tasks when user changes
            clearTasks: () => set({ tasks: [] })
        }),
        {
            name: 'webnote-tasks',
            storage: createJSONStorage(() => createUserStorage('webnote-tasks'))
        }
    )
)
