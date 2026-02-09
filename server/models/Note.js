import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled' },
    content: { type: mongoose.Schema.Types.Mixed }, // TipTap JSON content
    folder: String,
    tags: [String],
    color: String,
    isPinned: { type: Boolean, default: false }
}, { timestamps: true })

noteSchema.index({ userId: 1, updatedAt: -1 })

export default mongoose.model('Note', noteSchema)
