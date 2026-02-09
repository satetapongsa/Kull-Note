import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { useReminderStore } from '../../stores/reminderStore'
import {
    Bell,
    Sun,
    Moon,
    Menu,
    LogOut,
    User,
    ChevronDown
} from 'lucide-react'
import { useState, useEffect } from 'react'
import './Header.css'

const pageTitles = {
    '/dashboard': 'แดชบอร์ด',
    '/notes': 'โน้ต',
    '/tasks': 'รายการงาน',
    '/calendar': 'ปฏิทิน',
    '/goals': 'เป้าหมาย & งานอดิเรก',
    '/settings': 'ตั้งค่า'
}

function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const { theme, toggleTheme, toggleSidebar } = useThemeStore()
    const { getUpcoming, requestPermission, notificationPermission } = useReminderStore()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const upcomingReminders = getUpcoming(5)
    const pageTitle = pageTitles[location.pathname] || 'Kull Note'

    useEffect(() => {
        if (notificationPermission === 'default') {
            requestPermission()
        }
    }, [])

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        navigate('/')
    }

    return (
        <header className="header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <h1 className="page-title">{pageTitle}</h1>
            </div>

            <div className="header-right">
                {/* Theme Toggle */}
                <button className="header-btn" onClick={toggleTheme} title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <div className="notification-wrapper">
                    <button
                        className="header-btn notification-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        {upcomingReminders.length > 0 && (
                            <span className="notification-badge">{upcomingReminders.length}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="dropdown-header">
                                <h3>การแจ้งเตือน</h3>
                            </div>
                            <div className="dropdown-content">
                                {upcomingReminders.length === 0 ? (
                                    <p className="no-notifications">ไม่มีการแจ้งเตือน</p>
                                ) : (
                                    upcomingReminders.map((reminder) => (
                                        <div key={reminder.id} className="notification-item">
                                            <div className="notification-title">{reminder.title}</div>
                                            <div className="notification-time">
                                                {new Date(reminder.datetime).toLocaleString('th-TH', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="user-wrapper">
                    <button
                        className="user-btn"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="user-avatar" />
                        ) : (
                            <div className="user-avatar-placeholder">
                                <User size={18} />
                            </div>
                        )}
                        <span className="user-name">{user?.name || 'ผู้ใช้'}</span>
                        <ChevronDown size={16} />
                    </button>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <div className="dropdown-header">
                                <div className="user-info">
                                    <strong>{user?.name}</strong>
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                            <div className="dropdown-content">
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    <span>ออกจากระบบ</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
