import { useState } from 'react'
import { useGoalStore } from '../stores/goalStore'
import { Plus, Target, Sparkles, X, Check, Trash2, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import './Goals.css'

const goalCategories = [
    { id: 'personal', name: 'ส่วนตัว', icon: '🏠' },
    { id: 'career', name: 'อาชีพ', icon: '💼' },
    { id: 'health', name: 'สุขภาพ', icon: '💪' },
    { id: 'finance', name: 'การเงิน', icon: '💰' },
    { id: 'education', name: 'การศึกษา', icon: '📚' }
]

function Goals() {
    const { goals, hobbies, createGoal, updateGoal, deleteGoal, updateProgress, addMilestone, toggleMilestone, createHobby, updateHobby, deleteHobby, logSession, getGoalStats, getHobbyStats } = useGoalStore()
    const [showGoalModal, setShowGoalModal] = useState(false)
    const [showHobbyModal, setShowHobbyModal] = useState(false)
    const [newGoal, setNewGoal] = useState({ title: '', description: '', category: 'personal', targetDate: '' })
    const [newHobby, setNewHobby] = useState({ name: '', description: '', icon: '🎨', frequency: 'weekly' })
    const [newMilestone, setNewMilestone] = useState('')
    const [expandedGoal, setExpandedGoal] = useState(null)

    const goalStats = getGoalStats()
    const hobbyStats = getHobbyStats()

    const handleCreateGoal = () => {
        if (!newGoal.title.trim()) { toast.error('กรุณาใส่ชื่อเป้าหมาย'); return }
        createGoal(newGoal)
        setNewGoal({ title: '', description: '', category: 'personal', targetDate: '' })
        setShowGoalModal(false)
        toast.success('สร้างเป้าหมายแล้ว')
    }

    const handleCreateHobby = () => {
        if (!newHobby.name.trim()) { toast.error('กรุณาใส่ชื่องานอดิเรก'); return }
        createHobby(newHobby)
        setNewHobby({ name: '', description: '', icon: '🎨', frequency: 'weekly' })
        setShowHobbyModal(false)
        toast.success('เพิ่มงานอดิเรกแล้ว')
    }

    return (
        <div className="goals-page">
            <div className="goals-header">
                <h1>เป้าหมาย & งานอดิเรก</h1>
                <div className="stats-row">
                    <div className="stat-item"><Target size={16} /><span>{goalStats.active} เป้าหมาย</span></div>
                    <div className="stat-item"><Sparkles size={16} /><span>{hobbies.length} งานอดิเรก</span></div>
                </div>
            </div>

            {/* Goals Section */}
            <section className="section">
                <div className="section-header">
                    <h2><Target size={20} />เป้าหมาย</h2>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowGoalModal(true)}><Plus size={16} />เพิ่ม</button>
                </div>
                {goals.length === 0 ? (
                    <div className="empty-state glass-card"><p>ยังไม่มีเป้าหมาย</p><button className="btn btn-secondary" onClick={() => setShowGoalModal(true)}>ตั้งเป้าหมายแรก</button></div>
                ) : (
                    <div className="goals-grid">
                        {goals.map(goal => (
                            <div key={goal.id} className={`goal-card glass-card ${goal.status}`}>
                                <div className="goal-header">
                                    <span className="goal-category">{goalCategories.find(c => c.id === goal.category)?.icon} {goalCategories.find(c => c.id === goal.category)?.name}</span>
                                    <button className="delete-btn" onClick={() => { if (confirm('ลบเป้าหมายนี้?')) deleteGoal(goal.id) }}><Trash2 size={14} /></button>
                                </div>
                                <h3>{goal.title}</h3>
                                {goal.description && <p className="goal-desc">{goal.description}</p>}
                                <div className="progress-section">
                                    <div className="progress-header"><span>ความคืบหน้า</span><span>{goal.progress}%</span></div>
                                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${goal.progress}%` }}></div></div>
                                    <input type="range" min="0" max="100" value={goal.progress} onChange={e => updateProgress(goal.id, parseInt(e.target.value))} />
                                </div>
                                <div className="milestones-section">
                                    <h4>Milestones</h4>
                                    {goal.milestones?.map(m => (
                                        <div key={m.id} className={`milestone ${m.completed ? 'done' : ''}`} onClick={() => toggleMilestone(goal.id, m.id)}>
                                            <span className="milestone-check">{m.completed && <Check size={12} />}</span>
                                            <span>{m.title}</span>
                                        </div>
                                    ))}
                                    <div className="add-milestone">
                                        <input placeholder="เพิ่ม milestone..." value={expandedGoal === goal.id ? newMilestone : ''} onFocus={() => setExpandedGoal(goal.id)} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newMilestone.trim()) { addMilestone(goal.id, newMilestone); setNewMilestone('') } }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Hobbies Section */}
            <section className="section">
                <div className="section-header">
                    <h2><Sparkles size={20} />งานอดิเรก</h2>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowHobbyModal(true)}><Plus size={16} />เพิ่ม</button>
                </div>
                {hobbies.length === 0 ? (
                    <div className="empty-state glass-card"><p>ยังไม่มีงานอดิเรก</p><button className="btn btn-secondary" onClick={() => setShowHobbyModal(true)}>เพิ่มงานอดิเรก</button></div>
                ) : (
                    <div className="hobbies-grid">
                        {hobbies.map(hobby => (
                            <div key={hobby.id} className="hobby-card glass-card">
                                <div className="hobby-icon">{hobby.icon}</div>
                                <div className="hobby-info">
                                    <h3>{hobby.name}</h3>
                                    <p>{hobby.totalHours?.toFixed(1) || 0} ชั่วโมง</p>
                                </div>
                                <button className="log-btn btn btn-secondary btn-sm" onClick={() => { logSession(hobby.id, 60); toast.success('บันทึก 1 ชั่วโมง') }}>+1h</button>
                                <button className="delete-btn" onClick={() => { if (confirm('ลบ?')) deleteHobby(hobby.id) }}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Goal Modal */}
            {showGoalModal && (
                <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
                    <div className="modal glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>เพิ่มเป้าหมาย</h2><button className="close-btn" onClick={() => setShowGoalModal(false)}><X size={20} /></button></div>
                        <div className="modal-body">
                            <div className="form-group"><label>ชื่อเป้าหมาย *</label><input value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} autoFocus /></div>
                            <div className="form-group"><label>รายละเอียด</label><textarea value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} rows={2} /></div>
                            <div className="form-row">
                                <div className="form-group"><label>หมวดหมู่</label><select value={newGoal.category} onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}>{goalCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
                                <div className="form-group"><label>วันเป้าหมาย</label><input type="date" value={newGoal.targetDate} onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowGoalModal(false)}>ยกเลิก</button><button className="btn btn-primary" onClick={handleCreateGoal}>สร้าง</button></div>
                    </div>
                </div>
            )}

            {/* Hobby Modal */}
            {showHobbyModal && (
                <div className="modal-overlay" onClick={() => setShowHobbyModal(false)}>
                    <div className="modal glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>เพิ่มงานอดิเรก</h2><button className="close-btn" onClick={() => setShowHobbyModal(false)}><X size={20} /></button></div>
                        <div className="modal-body">
                            <div className="form-group"><label>ชื่อ *</label><input value={newHobby.name} onChange={e => setNewHobby({ ...newHobby, name: e.target.value })} autoFocus /></div>
                            <div className="form-row">
                                <div className="form-group"><label>ไอคอน</label><select value={newHobby.icon} onChange={e => setNewHobby({ ...newHobby, icon: e.target.value })}><option value="🎨">🎨 ศิลปะ</option><option value="🎵">🎵 ดนตรี</option><option value="📖">📖 อ่านหนังสือ</option><option value="🏃">🏃 กีฬา</option><option value="🎮">🎮 เกม</option><option value="📷">📷 ถ่ายรูป</option><option value="🍳">🍳 ทำอาหาร</option></select></div>
                                <div className="form-group"><label>ความถี่</label><select value={newHobby.frequency} onChange={e => setNewHobby({ ...newHobby, frequency: e.target.value })}><option value="daily">ทุกวัน</option><option value="weekly">ทุกสัปดาห์</option><option value="monthly">ทุกเดือน</option></select></div>
                            </div>
                        </div>
                        <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowHobbyModal(false)}>ยกเลิก</button><button className="btn btn-primary" onClick={handleCreateHobby}>เพิ่ม</button></div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Goals
