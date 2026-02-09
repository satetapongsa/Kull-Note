import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useTaskStore } from '../stores/taskStore'
import { useReminderStore } from '../stores/reminderStore'
import { Plus, X, Bell, Calendar as CalIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import './Calendar.css'

function Calendar() {
    const { tasks, createTask, categories, priorities } = useTaskStore()
    const { reminders, createReminder } = useReminderStore()
    const [showModal, setShowModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [modalType, setModalType] = useState('task')
    const [formData, setFormData] = useState({
        title: '', description: '', time: '', priority: 'medium', category: 'general', repeat: null
    })

    const events = useMemo(() => {
        const taskEvents = tasks.filter(t => t.dueDate).map(task => ({
            id: `task-${task.id}`, title: task.title, date: task.dueDate,
            backgroundColor: task.status === 'done' ? '#64748b' : priorities.find(p => p.id === task.priority)?.color || '#6366f1',
            borderColor: 'transparent', extendedProps: { type: 'task', data: task }
        }))
        const reminderEvents = reminders.filter(r => r.isActive).map(reminder => ({
            id: `reminder-${reminder.id}`, title: `🔔 ${reminder.title}`, start: reminder.datetime,
            backgroundColor: '#f59e0b', borderColor: 'transparent', extendedProps: { type: 'reminder', data: reminder }
        }))
        return [...taskEvents, ...reminderEvents]
    }, [tasks, reminders, priorities])

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr)
        setFormData({ ...formData, time: '' })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.title.trim()) { toast.error('กรุณาใส่ชื่อ'); return }
        if (modalType === 'task') {
            createTask({ title: formData.title, description: formData.description, dueDate: selectedDate, dueTime: formData.time, priority: formData.priority, category: formData.category })
            toast.success('สร้าง Task แล้ว')
        } else {
            const datetime = formData.time ? `${selectedDate}T${formData.time}:00` : `${selectedDate}T09:00:00`
            createReminder({ title: formData.title, message: formData.description, datetime, repeat: formData.repeat })
            toast.success('สร้างการแจ้งเตือนแล้ว')
        }
        setShowModal(false)
        setFormData({ title: '', description: '', time: '', priority: 'medium', category: 'general', repeat: null })
    }

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <h1>ปฏิทิน</h1>
                <button className="btn btn-primary" onClick={() => { setSelectedDate(new Date().toISOString().split('T')[0]); setShowModal(true) }}>
                    <Plus size={18} /><span>เพิ่มกิจกรรม</span>
                </button>
            </div>
            <div className="calendar-container glass-card">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                    locale="th" buttonText={{ today: 'วันนี้', month: 'เดือน', week: 'สัปดาห์', day: 'วัน' }}
                    events={events} dateClick={handleDateClick} eventClick={(info) => toast(info.event.title)}
                    height="auto" dayMaxEvents={3}
                />
            </div>
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>เพิ่มกิจกรรม - {selectedDate}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="type-toggle">
                                <button className={modalType === 'task' ? 'active' : ''} onClick={() => setModalType('task')}><CalIcon size={16} />Task</button>
                                <button className={modalType === 'reminder' ? 'active' : ''} onClick={() => setModalType('reminder')}><Bell size={16} />แจ้งเตือน</button>
                            </div>
                            <div className="form-group"><label>ชื่อ *</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} autoFocus /></div>
                            <div className="form-group"><label>รายละเอียด</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
                            <div className="form-group"><label>เวลา</label><input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} /></div>
                            {modalType === 'task' && (
                                <div className="form-row">
                                    <div className="form-group"><label>หมวดหมู่</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
                                    <div className="form-group"><label>ความสำคัญ</label><select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>{priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                                </div>
                            )}
                            {modalType === 'reminder' && (
                                <div className="form-group"><label>ซ้ำ</label><select value={formData.repeat || ''} onChange={e => setFormData({ ...formData, repeat: e.target.value || null })}><option value="">ไม่ซ้ำ</option><option value="daily">ทุกวัน</option><option value="weekly">ทุกสัปดาห์</option><option value="monthly">ทุกเดือน</option></select></div>
                            )}
                        </div>
                        <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button><button className="btn btn-primary" onClick={handleSubmit}>สร้าง</button></div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Calendar
