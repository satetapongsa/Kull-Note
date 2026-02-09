import { NavLink, useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../stores/themeStore'
import { useNoteStore } from '../../stores/noteStore'
import {
    Home,
    FileText,
    CheckSquare,
    Calendar,
    Target,
    Settings,
    Plus,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    Search
} from 'lucide-react'
import './Sidebar.css'

function Sidebar() {
    const navigate = useNavigate()
    const { sidebarCollapsed, toggleSidebar } = useThemeStore()
    const { folders, createNote, searchQuery, setSearchQuery } = useNoteStore()

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'แดชบอร์ด' },
        { path: '/notes', icon: FileText, label: 'โน้ต' },
        { path: '/tasks', icon: CheckSquare, label: 'งาน' },
        { path: '/calendar', icon: Calendar, label: 'ปฏิทิน' },
        { path: '/goals', icon: Target, label: 'เป้าหมาย' },
        { path: '/settings', icon: Settings, label: 'ตั้งค่า' }
    ]

    const handleNewNote = () => {
        const note = createNote()
        navigate(`/notes/${note.id}`)
    }

    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 100 100" width="32" height="32">
                            <defs>
                                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--primary)" />
                                    <stop offset="100%" stopColor="var(--secondary)" />
                                </linearGradient>
                            </defs>
                            <rect x="10" y="10" width="80" height="80" rx="15" fill="url(#logoGrad)" />
                            <path d="M30 35 L70 35 M30 50 L60 50 M30 65 L50 65" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>
                    {!sidebarCollapsed && <span className="logo-text">WebNote</span>}
                </div>
                <button className="collapse-btn" onClick={toggleSidebar}>
                    {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Quick Actions */}
            {!sidebarCollapsed && (
                <div className="sidebar-actions">
                    <button className="new-note-btn" onClick={handleNewNote}>
                        <Plus size={18} />
                        <span>โน้ตใหม่</span>
                    </button>
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="ค้นหา..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        title={sidebarCollapsed ? item.label : undefined}
                    >
                        <item.icon size={20} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Folders */}
            {!sidebarCollapsed && (
                <div className="sidebar-folders">
                    <div className="folder-header">
                        <FolderOpen size={16} />
                        <span>โฟลเดอร์</span>
                    </div>
                    <div className="folder-list">
                        {folders.map((folder) => (
                            <NavLink
                                key={folder.id}
                                to={`/notes?folder=${folder.id}`}
                                className="folder-item"
                            >
                                <span className="folder-icon">{folder.icon}</span>
                                <span className="folder-name">{folder.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}

            {/* Collapsed quick actions */}
            {sidebarCollapsed && (
                <div className="collapsed-actions">
                    <button className="icon-btn" onClick={handleNewNote} title="โน้ตใหม่">
                        <Plus size={20} />
                    </button>
                </div>
            )}
        </aside>
    )
}

export default Sidebar
