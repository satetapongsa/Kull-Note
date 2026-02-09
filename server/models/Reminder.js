import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: String,
    datetime: { type: Date, required: true },
    repeat: { type: String, enum: [null, 'daily', 'weekly', 'monthly'] },
    isActive: { type: Boolean, default: true },
    linkedTo: {
        type: { type: String, enum: ['task', 'note', 'goal'] },
        id: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true })

reminderSchema.index({ userId: 1, datetime: 1 })

export default mongoose.model('Reminder', reminderSchema)
