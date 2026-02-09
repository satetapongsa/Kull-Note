import express from 'express'
import Task from '../models/Task.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Helper to get user ID
const getUserId = (user) => user._id || user.id || user.googleId

// Get all tasks
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 })
        res.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        res.status(500).json({ error: error.message })
    }
})

// Create task
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        console.log('Creating task for user:', userId, req.body)
        const task = await Task.create({ ...req.body, userId })
        res.status(201).json(task)
    } catch (error) {
        console.error('Error creating task:', error)
        res.status(400).json({ error: error.message })
    }
})

// Update task
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId },
            req.body,
            { new: true }
        )
        if (!task) return res.status(404).json({ error: 'Task not found' })
        res.json(task)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Delete task
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId })
        if (!task) return res.status(404).json({ error: 'Task not found' })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
