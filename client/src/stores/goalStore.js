import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useGoalStore = create(
    persist(
        (set, get) => ({
            goals: [],
            hobbies: [],

            // Goals CRUD
            createGoal: (data) => {
                const newGoal = {
                    id: generateId(),
                    title: data.title || '',
                    description: data.description || '',
                    category: data.category || 'personal', // personal, career, health, finance, education
                    targetDate: data.targetDate || null,
                    progress: 0,
                    milestones: data.milestones || [],
                    status: 'active', // active, completed, paused
                    createdAt: new Date().toISOString(),
                    ...data
                }
                set((state) => ({
                    goals: [...state.goals, newGoal]
                }))
                return newGoal
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === id ? { ...goal, ...updates } : goal
                    )
                }))
            },

            deleteGoal: (id) => {
                set((state) => ({
                    goals: state.goals.filter((goal) => goal.id !== id)
                }))
            },

            updateProgress: (id, progress) => {
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === id
                            ? { ...goal, progress: Math.min(100, Math.max(0, progress)) }
                            : goal
                    )
                }))
            },

            addMilestone: (goalId, title) => {
                const milestone = {
                    id: generateId(),
                    title,
                    completed: false,
                    completedAt: null
                }
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === goalId
                            ? { ...goal, milestones: [...(goal.milestones || []), milestone] }
                            : goal
                    )
                }))
            },

            toggleMilestone: (goalId, milestoneId) => {
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === goalId
                            ? {
                                ...goal,
                                milestones: goal.milestones.map((m) =>
                                    m.id === milestoneId
                                        ? {
                                            ...m,
                                            completed: !m.completed,
                                            completedAt: !m.completed ? new Date().toISOString() : null
                                        }
                                        : m
                                )
                            }
                            : goal
                    )
                }))
            },

            // Hobbies CRUD
            createHobby: (data) => {
                const newHobby = {
                    id: generateId(),
                    name: data.name || '',
                    description: data.description || '',
                    icon: data.icon || '🎨',
                    color: data.color || '#6366f1',
                    frequency: data.frequency || 'weekly', // daily, weekly, monthly
                    lastPracticed: null,
                    totalHours: 0,
                    sessions: [],
                    createdAt: new Date().toISOString(),
                    ...data
                }
                set((state) => ({
                    hobbies: [...state.hobbies, newHobby]
                }))
                return newHobby
            },

            updateHobby: (id, updates) => {
                set((state) => ({
                    hobbies: state.hobbies.map((hobby) =>
                        hobby.id === id ? { ...hobby, ...updates } : hobby
                    )
                }))
            },

            deleteHobby: (id) => {
                set((state) => ({
                    hobbies: state.hobbies.filter((hobby) => hobby.id !== id)
                }))
            },

            logSession: (hobbyId, duration, notes = '') => {
                const session = {
                    id: generateId(),
                    date: new Date().toISOString(),
                    duration, // in minutes
                    notes
                }
                set((state) => ({
                    hobbies: state.hobbies.map((hobby) =>
                        hobby.id === hobbyId
                            ? {
                                ...hobby,
                                sessions: [...(hobby.sessions || []), session],
                                totalHours: (hobby.totalHours || 0) + duration / 60,
                                lastPracticed: new Date().toISOString()
                            }
                            : hobby
                    )
                }))
            },

            // Stats
            getGoalStats: () => {
                const { goals } = get()
                return {
                    total: goals.length,
                    active: goals.filter((g) => g.status === 'active').length,
                    completed: goals.filter((g) => g.status === 'completed').length,
                    avgProgress:
                        goals.length > 0
                            ? Math.round(
                                goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length
                            )
                            : 0
                }
            },

            getHobbyStats: () => {
                const { hobbies } = get()
                return {
                    total: hobbies.length,
                    totalHours: hobbies.reduce((sum, h) => sum + (h.totalHours || 0), 0),
                    mostPracticed: hobbies.sort(
                        (a, b) => (b.totalHours || 0) - (a.totalHours || 0)
                    )[0]
                }
            }
        }),
        {
            name: 'webnote-goals'
        }
    )
)
