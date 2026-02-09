import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useReminderStore = create(
    persist(
        (set, get) => ({
            reminders: [],
            notificationPermission: 'default',

            // Request notification permission
            requestPermission: async () => {
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission()
                    set({ notificationPermission: permission })
                    return permission
                }
                return 'denied'
            },

            // Create reminder
            createReminder: (data) => {
                const newReminder = {
                    id: generateId(),
                    title: data.title || '',
                    message: data.message || '',
                    datetime: data.datetime,
                    repeat: data.repeat || null, // null, daily, weekly, monthly
                    isActive: true,
                    linkedTo: data.linkedTo || null, // { type: 'task' | 'note' | 'goal', id: '' }
                    createdAt: new Date().toISOString(),
                    ...data
                }
                set((state) => ({
                    reminders: [...state.reminders, newReminder]
                }))

                // Schedule notification
                get().scheduleNotification(newReminder)

                return newReminder
            },

            updateReminder: (id, updates) => {
                set((state) => ({
                    reminders: state.reminders.map((reminder) =>
                        reminder.id === id ? { ...reminder, ...updates } : reminder
                    )
                }))
            },

            deleteReminder: (id) => {
                set((state) => ({
                    reminders: state.reminders.filter((reminder) => reminder.id !== id)
                }))
            },

            toggleReminder: (id) => {
                set((state) => ({
                    reminders: state.reminders.map((reminder) =>
                        reminder.id === id
                            ? { ...reminder, isActive: !reminder.isActive }
                            : reminder
                    )
                }))
            },

            // Schedule browser notification
            scheduleNotification: (reminder) => {
                if (get().notificationPermission !== 'granted') return

                const now = new Date()
                const reminderTime = new Date(reminder.datetime)
                const timeUntil = reminderTime.getTime() - now.getTime()

                if (timeUntil > 0) {
                    setTimeout(() => {
                        if (reminder.isActive) {
                            new Notification(reminder.title, {
                                body: reminder.message,
                                icon: '/icon.svg',
                                tag: reminder.id
                            })

                            // Handle repeat
                            if (reminder.repeat) {
                                const newDate = new Date(reminder.datetime)
                                switch (reminder.repeat) {
                                    case 'daily':
                                        newDate.setDate(newDate.getDate() + 1)
                                        break
                                    case 'weekly':
                                        newDate.setDate(newDate.getDate() + 7)
                                        break
                                    case 'monthly':
                                        newDate.setMonth(newDate.getMonth() + 1)
                                        break
                                }
                                get().updateReminder(reminder.id, { datetime: newDate.toISOString() })
                                get().scheduleNotification({ ...reminder, datetime: newDate.toISOString() })
                            }
                        }
                    }, timeUntil)
                }
            },

            // Check and init all reminders on load
            initReminders: () => {
                const { reminders, scheduleNotification } = get()
                reminders
                    .filter((r) => r.isActive)
                    .forEach((reminder) => {
                        scheduleNotification(reminder)
                    })
            },

            // Get upcoming reminders
            getUpcoming: (limit = 5) => {
                const { reminders } = get()
                const now = new Date()
                return reminders
                    .filter((r) => r.isActive && new Date(r.datetime) > now)
                    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                    .slice(0, limit)
            },

            // Get today's reminders
            getTodayReminders: () => {
                const { reminders } = get()
                const today = new Date().toISOString().split('T')[0]
                return reminders.filter(
                    (r) => r.isActive && r.datetime.startsWith(today)
                )
            }
        }),
        {
            name: 'webnote-reminders',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Init reminders after hydration
                    setTimeout(() => state.initReminders(), 100)
                }
            }
        }
    )
)
