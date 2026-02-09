import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useNoteStore } from '../stores/noteStore'
import {
    Plus,
    Search,
    Grid,
    List,
    Pin,
    MoreVertical,
    Trash2,
    Copy,
    FolderOpen
} from 'lucide-react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import './Notes.css'

function Notes() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const folderId = searchParams.get('folder')

    const {
        folders,
        getFilteredNotes,
        createNote,
        deleteNote,
        duplicateNote,
        togglePin,
        searchQuery,
        setSearchQuery
    } = useNoteStore()

    const [viewMode, setViewMode] = useState('grid')
    const [activeMenu, setActiveMenu] = useState(null)

    const notes = getFilteredNotes(folderId)
    const currentFolder = folders.find((f) => f.id === folderId)

    const handleNewNote = () => {
        const note = createNote({ folder: folderId })
        navigate(`/notes/${note.id}`)
    }

    const handleNoteClick = (noteId) => {
        navigate(`/notes/${noteId}`)
    }

    const handleMenuClick = (e, noteId) => {
        e.stopPropagation()
        setActiveMenu(activeMenu === noteId ? null : noteId)
    }

    const handleAction = (e, action, noteId) => {
        e.stopPropagation()
        setActiveMenu(null)

        switch (action) {
            case 'pin':
                togglePin(noteId)
                break
            case 'duplicate':
                const newNote = duplicateNote(noteId)
                if (newNote) navigate(`/notes/${newNote.id}`)
                break
            case 'delete':
                if (confirm('ต้องการลบโน้ตนี้?')) {
                    deleteNote(noteId)
                }
                break
        }
    }

    const getPreviewText = (content) => {
        if (!content) return 'ไม่มีเนื้อหา'
        // Extract text from TipTap JSON content
        try {
            if (typeof content === 'object' && content.content) {
                return content.content
                    .map((node) => {
                        if (node.type === 'paragraph' && node.content) {
                            return node.content.map((c) => c.text || '').join('')
                        }
                        return ''
                    })
                    .filter(Boolean)
                    .join(' ')
                    .slice(0, 100) || 'ไม่มีเนื้อหา'
            }
        } catch {
            return 'ไม่มีเนื้อหา'
        }
        return 'ไม่มีเนื้อหา'
    }

    return (
        <div className="notes-page">
            {/* Header */}
            <div className="notes-header">
                <div className="notes-title-section">
                    <h1>
                        {currentFolder ? (
                            <>
                                <span className="folder-icon">{currentFolder.icon}</span>
                                {currentFolder.name}
                            </>
                        ) : (
                            'โน้ตทั้งหมด'
                        )}
                    </h1>
                    <span className="notes-count">{notes.length} โน้ต</span>
                </div>

                <div className="notes-actions">
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="ค้นหาโน้ต..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button className="btn btn-primary" onClick={handleNewNote}>
                        <Plus size={18} />
                        <span>โน้ตใหม่</span>
                    </button>
                </div>
            </div>

            {/* Notes Grid/List */}
            {notes.length === 0 ? (
                <div className="empty-notes">
                    <div className="empty-icon">📝</div>
                    <h2>ยังไม่มีโน้ต</h2>
                    <p>เริ่มต้นสร้างโน้ตแรกของคุณ</p>
                    <button className="btn btn-primary" onClick={handleNewNote}>
                        <Plus size={18} />
                        สร้างโน้ต
                    </button>
                </div>
            ) : (
                <div className={`notes-container ${viewMode}`}>
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className={`note-card glass-card ${note.isPinned ? 'pinned' : ''}`}
                            style={note.color ? { borderColor: note.color } : undefined}
                            onClick={() => handleNoteClick(note.id)}
                        >
                            {note.isPinned && (
                                <div className="pin-badge">
                                    <Pin size={12} />
                                </div>
                            )}

                            <div className="note-content">
                                <h3 className="note-title">{note.title || 'Untitled'}</h3>
                                <p className="note-preview">{getPreviewText(note.content)}</p>
                            </div>

                            <div className="note-footer">
                                <div className="note-meta">
                                    {note.folder && (
                                        <span className="note-folder">
                                            <FolderOpen size={12} />
                                            {folders.find((f) => f.id === note.folder)?.name}
                                        </span>
                                    )}
                                    <span className="note-date">
                                        {format(new Date(note.updatedAt), 'd MMM yyyy', { locale: th })}
                                    </span>
                                </div>

                                <div className="note-menu-wrapper">
                                    <button
                                        className="menu-btn"
                                        onClick={(e) => handleMenuClick(e, note.id)}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeMenu === note.id && (
                                        <div className="note-menu">
                                            <button onClick={(e) => handleAction(e, 'pin', note.id)}>
                                                <Pin size={14} />
                                                {note.isPinned ? 'เลิกปักหมุด' : 'ปักหมุด'}
                                            </button>
                                            <button onClick={(e) => handleAction(e, 'duplicate', note.id)}>
                                                <Copy size={14} />
                                                ทำสำเนา
                                            </button>
                                            <button
                                                className="danger"
                                                onClick={(e) => handleAction(e, 'delete', note.id)}
                                            >
                                                <Trash2 size={14} />
                                                ลบ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {note.tags && note.tags.length > 0 && (
                                <div className="note-tags">
                                    {note.tags.map((tag, idx) => (
                                        <span key={idx} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Notes
