import express from 'express'
import passport from 'passport'

const router = express.Router()

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173')
    }
)

// Get current user
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, avatar: req.user.avatar } })
    } else {
        res.status(401).json({ error: 'Not authenticated' })
    }
})

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' })
        res.json({ success: true })
    })
})

export default router
