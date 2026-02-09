import mongoose from 'mongoose'

const subtaskSchema = new mongoose.Schema({
    title: String,
    done: { type: Boolean, default: false }
})

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    dueTime: String,
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    category: { type: String, default: 'general' },
    tags: [String],
    subtasks: [subtaskSchema],
    completedAt: Date
}, { timestamps: true })

taskSchema.index({ userId: 1, dueDate: 1 })

export default mongoose.model('Task', taskSchema)
