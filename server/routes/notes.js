import express from 'express'
import Note from '../models/Note.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Helper to get user ID
const getUserId = (user) => user._id || user.id || user.googleId

// Get all notes
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const notes = await Note.find({ userId }).sort({ updatedAt: -1 })
        res.json(notes)
    } catch (error) {
        console.error('Error fetching notes:', error)
        res.status(500).json({ error: error.message })
    }
})

// Get single note
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const note = await Note.findOne({ _id: req.params.id, userId })
        if (!note) return res.status(404).json({ error: 'Note not found' })
        res.json(note)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Create note
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        console.log('Creating note for user:', userId, req.body)
        const note = await Note.create({ ...req.body, userId })
        res.status(201).json(note)
    } catch (error) {
        console.error('Error creating note:', error)
        res.status(400).json({ error: error.message })
    }
})

// Update note
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            { ...req.body, updatedAt: new Date() },
            { new: true }
        )
        if (!note) return res.status(404).json({ error: 'Note not found' })
        res.json(note)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Delete note
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const userId = getUserId(req.user)
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId })
        if (!note) return res.status(404).json({ error: 'Note not found' })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
