import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { setupPassport } from './config/passport.js'
import authRoutes from './routes/auth.js'
import noteRoutes from './routes/notes.js'
import taskRoutes from './routes/tasks.js'
import reminderRoutes from './routes/reminders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

// Passport setup
setupPassport()
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/auth', authRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/reminders', reminderRoutes)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return

    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI)
            console.log('✅ Connected to MongoDB')
        } catch (dbError) {
            console.log('⚠️  MongoDB not available, running without database')
        }
    }
}

// Start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const startServer = async () => {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        })
    }
    startServer()
}

// Export app for Vercel
export default async (req, res) => {
    await connectDB()
    return app(req, res)
}

