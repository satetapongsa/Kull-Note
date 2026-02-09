import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: String,
    preferences: {
        theme: { type: String, default: 'dark' },
        primaryColor: { type: String, default: '#6366f1' },
        fontSize: { type: Number, default: 16 }
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
