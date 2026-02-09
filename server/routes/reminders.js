import express from 'express'
import Reminder from '../models/Reminder.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Get all reminders
router.get('/', requireAuth, async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.user._id }).sort({ datetime: 1 })
        res.json(reminders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Create reminder
router.post('/', requireAuth, async (req, res) => {
    try {
        const reminder = await Reminder.create({ ...req.body, userId: req.user._id })
        res.status(201).json(reminder)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Update reminder
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        )
        if (!reminder) return res.status(404).json({ error: 'Reminder not found' })
        res.json(reminder)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Delete reminder
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        if (!reminder) return res.status(404).json({ error: 'Reminder not found' })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
