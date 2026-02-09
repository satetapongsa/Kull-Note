import { useState } from 'react'
import { useTaskStore } from '../stores/taskStore'
import { useReminderStore } from '../stores/reminderStore'
import {
    Plus,
    Filter,
    Check,
    Clock,
    AlertTriangle,
    MoreVertical,
    Trash2,
    Calendar,
    Bell,
    ChevronDown,
    ChevronRight,
    X
} from 'lucide-react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import toast from 'react-hot-toast'
import './Tasks.css'

function Tasks() {
    const {
        getFilteredTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        categories,
        priorities,
        filter,
        setFilter,
        clearFilters,
        getStats
    } = useTaskStore()
    const { createReminder } = useReminderStore()

    const [showAddModal, setShowAddModal] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [expandedTask, setExpandedTask] = useState(null)
    const [newSubtask, setNewSubtask] = useState('')
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        category: 'general',
        reminder: false
    })

    const tasks = getFilteredTasks()
    const stats = getStats()

    const handleCreateTask = () => {
        if (!newTask.title.trim()) {
            toast.error('กรุณาใส่ชื่อ Task')
            return
        }

        const task = createTask(newTask)

        // Create reminder if enabled
        if (newTask.reminder && newTask.dueDate && newTask.dueTime) {
            createReminder({
                title: newTask.title,
                message: `ถึงเวลาทำ: ${newTask.title}`,
                datetime: `${newTask.dueDate}T${newTask.dueTime}:00`,
                linkedTo: { type: 'task', id: task.id }
            })
        }

        setNewTask({
            title: '',
            description: '',
            dueDate: '',
            dueTime: '',
            priority: 'medium',
            category: 'general',
            reminder: false
        })
        setShowAddModal(false)
        toast.success('สร้าง Task แล้ว')
    }

    const handleAddSubtask = (taskId) => {
        if (newSubtask.trim()) {
            addSubtask(taskId, newSubtask)
            setNewSubtask('')
        }
    }

    const getPriorityColor = (priority) => {
        return priorities.find((p) => p.id === priority)?.color || '#64748b'
    }

    const getCategoryInfo = (categoryId) => {
        return categories.find((c) => c.id === categoryId) || categories[0]
    }

    return (
        <div className="tasks-page">
            {/* Header */}
            <div className="tasks-header">
                <div>
                    <h1>รายการงาน</h1>
                    <div className="task-stats">
                        <span className="stat-pill">
                            <Check size={14} /> {stats.done} เสร็จ
                        </span>
                        <span className="stat-pill">
                            <Clock size={14} /> {stats.todo + stats.inProgress} ค้างอยู่
                        </span>
                        {stats.overdue > 0 && (
                            <span className="stat-pill danger">
                                <AlertTriangle size={14} /> {stats.overdue} เลยกำหนด
                            </span>
                        )}
                    </div>
                </div>

                <div className="header-actions">
                    <button
                        className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} />
                        <span>กรอง</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} />
                        <span>เพิ่ม Task</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="filters-bar glass-card">
                    <div className="filter-group">
                        <label>สถานะ</label>
                        <select
                            value={filter.status || ''}
                            onChange={(e) => setFilter('status', e.target.value || null)}
                        >
                            <option value="">ทั้งหมด</option>
                            <option value="todo">รอดำเนินการ</option>
                            <option value="in-progress">กำลังทำ</option>
                            <option value="done">เสร็จแล้ว</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>หมวดหมู่</label>
                        <select
                            value={filter.category || ''}
                            onChange={(e) => setFilter('category', e.target.value || null)}
                        >
                            <option value="">ทั้งหมด</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>ความสำคัญ</label>
                        <select
                            value={filter.priority || ''}
                            onChange={(e) => setFilter('priority', e.target.value || null)}
                        >
                            <option value="">ทั้งหมด</option>
                            {priorities.map((pri) => (
                                <option key={pri.id} value={pri.id}>
                                    {pri.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-ghost" onClick={clearFilters}>
                        ล้างตัวกรอง
                    </button>
                </div>
            )}

            {/* Task List */}
            <div className="task-list">
                {tasks.length === 0 ? (
                    <div className="empty-tasks">
                        <div className="empty-icon">📋</div>
                        <h2>ยังไม่มี Task</h2>
                        <p>เริ่มต้นสร้าง Task แรกของคุณ</p>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} />
                            สร้าง Task
                        </button>
                    </div>
                ) : (
                    tasks.map((task) => {
                        const categoryInfo = getCategoryInfo(task.category)
                        const isExpanded = expandedTask === task.id

                        return (
                            <div
                                key={task.id}
                                className={`task-card glass-card ${task.status}`}
                            >
                                <div className="task-main">
                                    <button
                                        className={`check-btn ${task.status === 'done' ? 'checked' : ''}`}
                                        onClick={() => toggleTaskStatus(task.id)}
                                        style={{ borderColor: getPriorityColor(task.priority) }}
                                    >
                                        {task.status === 'done' && <Check size={14} />}
                                    </button>

                                    <div className="task-content" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                                        <div className="task-header">
                                            <h3 className={task.status === 'done' ? 'completed' : ''}>
                                                {task.title}
                                            </h3>
                                            <span
                                                className="priority-badge"
                                                style={{ background: getPriorityColor(task.priority) }}
                                            >
                                                {priorities.find((p) => p.id === task.priority)?.name}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}

                                        <div className="task-meta">
                                            <span className="category-badge" style={{ color: categoryInfo.color }}>
                                                {categoryInfo.icon} {categoryInfo.name}
                                            </span>
                                            {task.dueDate && (
                                                <span className={`due-date ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'overdue' : ''}`}>
                                                    <Calendar size={12} />
                                                    {format(new Date(task.dueDate), 'd MMM', { locale: th })}
                                                </span>
                                            )}
                                            {task.subtasks && task.subtasks.length > 0 && (
                                                <span className="subtask-count">
                                                    {task.subtasks.filter((st) => st.done).length}/{task.subtasks.length}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className="expand-btn"
                                        onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                                    >
                                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            if (confirm('ต้องการลบ Task นี้?')) {
                                                deleteTask(task.id)
                                                toast.success('ลบ Task แล้ว')
                                            }
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Expanded Section */}
                                {isExpanded && (
                                    <div className="task-expanded">
                                        <div className="subtasks-section">
                                            <h4>Subtasks</h4>
                                            <div className="subtasks-list">
                                                {task.subtasks && task.subtasks.map((st) => (
                                                    <div key={st.id} className="subtask-item">
                                                        <button
                                                            className={`subtask-check ${st.done ? 'checked' : ''}`}
                                                            onClick={() => toggleSubtask(task.id, st.id)}
                                                        >
                                                            {st.done && <Check size={12} />}
                                                        </button>
                                                        <span className={st.done ? 'completed' : ''}>{st.title}</span>
                                                        <button
                                                            className="subtask-delete"
                                                            onClick={() => deleteSubtask(task.id, st.id)}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="add-subtask">
                                                <input
                                                    type="text"
                                                    placeholder="เพิ่ม subtask..."
                                                    value={newSubtask}
                                                    onChange={(e) => setNewSubtask(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddSubtask(task.id)
                                                    }}
                                                />
                                                <button onClick={() => handleAddSubtask(task.id)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>เพิ่ม Task ใหม่</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>ชื่อ Task *</label>
                                <input
                                    type="text"
                                    placeholder="ต้องทำอะไร?"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>รายละเอียด</label>
                                <textarea
                                    placeholder="รายละเอียดเพิ่มเติม..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>วันครบกำหนด</label>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>เวลา</label>
                                    <input
                                        type="time"
                                        value={newTask.dueTime}
                                        onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>หมวดหมู่</label>
                                    <select
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>ความสำคัญ</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        {priorities.map((pri) => (
                                            <option key={pri.id} value={pri.id}>
                                                {pri.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={newTask.reminder}
                                    onChange={(e) => setNewTask({ ...newTask, reminder: e.target.checked })}
                                />
                                <Bell size={14} />
                                <span>แจ้งเตือนเมื่อถึงเวลา</span>
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                ยกเลิก
                            </button>
                            <button className="btn btn-primary" onClick={handleCreateTask}>
                                สร้าง Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Tasks
