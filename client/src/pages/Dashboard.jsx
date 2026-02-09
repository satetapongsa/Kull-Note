import { useNavigate } from 'react-router-dom'
import { useNoteStore } from '../stores/noteStore'
import { useTaskStore } from '../stores/taskStore'
import { useGoalStore } from '../stores/goalStore'
import { useReminderStore } from '../stores/reminderStore'
import {
    FileText,
    CheckSquare,
    Target,
    Bell,
    Plus,
    ArrowRight,
    TrendingUp,
    Clock,
    AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const { notes, createNote } = useNoteStore()
    const { getStats, getTodayTasks, getOverdueTasks } = useTaskStore()
    const { goals, hobbies, getGoalStats } = useGoalStore()
    const { getUpcoming } = useReminderStore()

    const taskStats = getStats()
    const goalStats = getGoalStats()
    const todayTasks = getTodayTasks()
    const overdueTasks = getOverdueTasks()
    const upcomingReminders = getUpcoming(3)
    const recentNotes = notes.slice(0, 4)

    const handleNewNote = () => {
        const note = createNote()
        navigate(`/notes/${note.id}`)
    }

    const stats = [
        {
            label: 'โน้ตทั้งหมด',
            value: notes.length,
            icon: FileText,
            color: 'var(--primary)',
            link: '/notes'
        },
        {
            label: 'งานที่เสร็จ',
            value: `${taskStats.done}/${taskStats.total}`,
            icon: CheckSquare,
            color: 'var(--success)',
            link: '/tasks'
        },
        {
            label: 'เป้าหมาย',
            value: goals.filter(g => g.status === 'active').length,
            icon: Target,
            color: 'var(--secondary)',
            link: '/goals'
        },
        {
            label: 'การแจ้งเตือน',
            value: upcomingReminders.length,
            icon: Bell,
            color: 'var(--warning)',
            link: '/calendar'
        }
    ]

    return (
        <div className="dashboard">
            {/* Welcome Header */}
            <div className="dashboard-header">
                <div>
                    <h1>ยินดีต้อนรับกลับมา! 👋</h1>
                    <p className="text-secondary">
                        {format(new Date(), 'วันEEEEที่ d MMMM yyyy', { locale: th })}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleNewNote}>
                    <Plus size={18} />
                    <span>สร้างโน้ตใหม่</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card glass-card"
                        onClick={() => navigate(stat.link)}
                    >
                        <div className="stat-icon" style={{ background: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Today's Tasks */}
                <div className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2>
                            <Clock size={20} />
                            งานวันนี้
                        </h2>
                        <button className="btn btn-ghost" onClick={() => navigate('/tasks')}>
                            ดูทั้งหมด <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="section-content">
                        {todayTasks.length === 0 ? (
                            <div className="empty-state">
                                <p>🎉 ไม่มีงานวันนี้</p>
                            </div>
                        ) : (
                            <ul className="task-list">
                                {todayTasks.slice(0, 5).map((task) => (
                                    <li key={task.id} className="task-item">
                                        <span className={`priority-dot priority-${task.priority}`}></span>
                                        <span className="task-title">{task.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                    <div className="dashboard-section glass-card warning">
                        <div className="section-header">
                            <h2>
                                <AlertTriangle size={20} />
                                งานที่เลยกำหนด
                            </h2>
                        </div>
                        <div className="section-content">
                            <ul className="task-list">
                                {overdueTasks.slice(0, 3).map((task) => (
                                    <li key={task.id} className="task-item overdue">
                                        <span className="task-title">{task.title}</span>
                                        <span className="task-date">{task.dueDate}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Recent Notes */}
                <div className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2>
                            <FileText size={20} />
                            โน้ตล่าสุด
                        </h2>
                        <button className="btn btn-ghost" onClick={() => navigate('/notes')}>
                            ดูทั้งหมด <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="section-content">
                        {recentNotes.length === 0 ? (
                            <div className="empty-state">
                                <p>ยังไม่มีโน้ต</p>
                                <button className="btn btn-secondary" onClick={handleNewNote}>
                                    สร้างโน้ตแรก
                                </button>
                            </div>
                        ) : (
                            <div className="notes-list">
                                {recentNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="note-preview"
                                        onClick={() => navigate(`/notes/${note.id}`)}
                                    >
                                        <div className="note-title">{note.title || 'Untitled'}</div>
                                        <div className="note-date">
                                            {format(new Date(note.updatedAt), 'd MMM', { locale: th })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Goals Progress */}
                <div className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2>
                            <TrendingUp size={20} />
                            ความคืบหน้าเป้าหมาย
                        </h2>
                        <button className="btn btn-ghost" onClick={() => navigate('/goals')}>
                            ดูทั้งหมด <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="section-content">
                        {goals.filter(g => g.status === 'active').length === 0 ? (
                            <div className="empty-state">
                                <p>ยังไม่มีเป้าหมาย</p>
                                <button className="btn btn-secondary" onClick={() => navigate('/goals')}>
                                    ตั้งเป้าหมาย
                                </button>
                            </div>
                        ) : (
                            <div className="goals-list">
                                {goals
                                    .filter((g) => g.status === 'active')
                                    .slice(0, 3)
                                    .map((goal) => (
                                        <div key={goal.id} className="goal-item">
                                            <div className="goal-info">
                                                <div className="goal-title">{goal.title}</div>
                                                <div className="goal-progress-text">{goal.progress}%</div>
                                            </div>
                                            <div className="goal-progress-bar">
                                                <div
                                                    className="goal-progress-fill"
                                                    style={{ width: `${goal.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Reminders */}
                <div className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2>
                            <Bell size={20} />
                            การแจ้งเตือนที่กำลังมาถึง
                        </h2>
                    </div>
                    <div className="section-content">
                        {upcomingReminders.length === 0 ? (
                            <div className="empty-state">
                                <p>ไม่มีการแจ้งเตือน</p>
                            </div>
                        ) : (
                            <ul className="reminder-list">
                                {upcomingReminders.map((reminder) => (
                                    <li key={reminder.id} className="reminder-item">
                                        <div className="reminder-title">{reminder.title}</div>
                                        <div className="reminder-time">
                                            {format(new Date(reminder.datetime), 'd MMM HH:mm', { locale: th })}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
