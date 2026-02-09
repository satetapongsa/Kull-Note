import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { useNoteStore } from '../stores/noteStore'
import {
    ArrowLeft,
    Save,
    Trash2,
    Pin,
    FolderOpen,
    Tag,
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Undo,
    Redo
} from 'lucide-react'
import toast from 'react-hot-toast'
import './NoteEditor.css'

function NoteEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getNoteById, createNote, updateNote, deleteNote, togglePin, folders } = useNoteStore()

    const [note, setNote] = useState(null)
    const [title, setTitle] = useState('')
    const [selectedFolder, setSelectedFolder] = useState(null)
    const [showFolderMenu, setShowFolderMenu] = useState(false)
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'เริ่มเขียนโน้ตของคุณ...',
            }),
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            debouncedSave(editor.getJSON())
        },
    })

    // Load or create note
    useEffect(() => {
        if (id && id !== 'new') {
            const existingNote = getNoteById(id)
            if (existingNote) {
                setNote(existingNote)
                setTitle(existingNote.title || '')
                setSelectedFolder(existingNote.folder)
                setTags(existingNote.tags || [])
                if (editor && existingNote.content) {
                    editor.commands.setContent(existingNote.content)
                }
            } else {
                navigate('/notes')
            }
        } else if (!id || id === 'new') {
            const newNote = createNote()
            setNote(newNote)
            navigate(`/notes/${newNote.id}`, { replace: true })
        }
    }, [id])

    // Set editor content when note changes
    useEffect(() => {
        if (note && editor && note.content) {
            editor.commands.setContent(note.content)
        }
    }, [editor])

    // Debounced save
    const debouncedSave = useCallback(
        debounce((content) => {
            if (note) {
                updateNote(note.id, { content })
            }
        }, 1000),
        [note]
    )

    const handleSave = () => {
        if (!note) return
        setIsSaving(true)
        updateNote(note.id, {
            title: title || 'Untitled',
            content: editor?.getJSON(),
            folder: selectedFolder,
            tags
        })
        setTimeout(() => {
            setIsSaving(false)
            toast.success('บันทึกแล้ว')
        }, 300)
    }

    const handleTitleChange = (e) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        if (note) {
            updateNote(note.id, { title: newTitle })
        }
    }

    const handleFolderSelect = (folderId) => {
        setSelectedFolder(folderId)
        setShowFolderMenu(false)
        if (note) {
            updateNote(note.id, { folder: folderId })
        }
    }

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            const newTags = [...tags, tagInput.trim()]
            setTags(newTags)
            setTagInput('')
            if (note) {
                updateNote(note.id, { tags: newTags })
            }
        }
    }

    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index)
        setTags(newTags)
        if (note) {
            updateNote(note.id, { tags: newTags })
        }
    }

    const handleDelete = () => {
        if (confirm('ต้องการลบโน้ตนี้?')) {
            deleteNote(note.id)
            navigate('/notes')
            toast.success('ลบโน้ตแล้ว')
        }
    }

    const handlePin = () => {
        if (note) {
            togglePin(note.id)
            toast.success(note.isPinned ? 'เลิกปักหมุดแล้ว' : 'ปักหมุดแล้ว')
        }
    }

    if (!editor) return null

    const currentFolder = folders.find((f) => f.id === selectedFolder)

    return (
        <div className="note-editor-page">
            {/* Toolbar */}
            <div className="editor-toolbar">
                <button className="toolbar-btn" onClick={() => navigate('/notes')}>
                    <ArrowLeft size={18} />
                </button>

                <div className="toolbar-divider" />

                <div className="format-buttons">
                    <button
                        className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="ตัวหนา"
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="ตัวเอียง"
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        title="ขีดฆ่า"
                    >
                        <Strikethrough size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('highlight') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        title="ไฮไลท์"
                    >
                        <Highlighter size={16} />
                    </button>

                    <div className="toolbar-divider" />

                    <button
                        className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        title="หัวข้อ 1"
                    >
                        <Heading1 size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        title="หัวข้อ 2"
                    >
                        <Heading2 size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        title="หัวข้อ 3"
                    >
                        <Heading3 size={16} />
                    </button>

                    <div className="toolbar-divider" />

                    <button
                        className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        title="รายการ"
                    >
                        <List size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        title="รายการตัวเลข"
                    >
                        <ListOrdered size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('taskList') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        title="รายการเช็ค"
                    >
                        <CheckSquare size={16} />
                    </button>

                    <div className="toolbar-divider" />

                    <button
                        className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        title="อ้างอิง"
                    >
                        <Quote size={16} />
                    </button>
                    <button
                        className={`toolbar-btn ${editor.isActive('codeBlock') ? 'active' : ''}`}
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        title="โค้ด"
                    >
                        <Code size={16} />
                    </button>

                    <div className="toolbar-divider" />

                    <button
                        className="toolbar-btn"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo size={16} />
                    </button>
                    <button
                        className="toolbar-btn"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo size={16} />
                    </button>
                </div>

                <div className="toolbar-spacer" />

                <div className="toolbar-actions">
                    <button
                        className={`toolbar-btn ${note?.isPinned ? 'active' : ''}`}
                        onClick={handlePin}
                        title="ปักหมุด"
                    >
                        <Pin size={18} />
                    </button>
                    <button className="toolbar-btn danger" onClick={handleDelete} title="ลบ">
                        <Trash2 size={18} />
                    </button>
                    <button
                        className={`btn btn-primary ${isSaving ? 'saving' : ''}`}
                        onClick={handleSave}
                    >
                        <Save size={16} />
                        <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึก'}</span>
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="editor-container">
                <div className="editor-header">
                    <input
                        type="text"
                        className="title-input"
                        placeholder="หัวข้อโน้ต"
                        value={title}
                        onChange={handleTitleChange}
                    />

                    <div className="editor-meta">
                        <div className="meta-item folder-select">
                            <button onClick={() => setShowFolderMenu(!showFolderMenu)}>
                                <FolderOpen size={14} />
                                {currentFolder ? currentFolder.name : 'เลือกโฟลเดอร์'}
                            </button>
                            {showFolderMenu && (
                                <div className="folder-menu">
                                    <button onClick={() => handleFolderSelect(null)}>
                                        ไม่มีโฟลเดอร์
                                    </button>
                                    {folders.map((folder) => (
                                        <button
                                            key={folder.id}
                                            onClick={() => handleFolderSelect(folder.id)}
                                            className={selectedFolder === folder.id ? 'active' : ''}
                                        >
                                            {folder.icon} {folder.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="meta-item tags-input">
                            <Tag size={14} />
                            <div className="tags-container">
                                {tags.map((tag, index) => (
                                    <span key={index} className="tag" onClick={() => handleRemoveTag(index)}>
                                        {tag} ×
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="เพิ่มแท็ก..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <EditorContent editor={editor} className="editor-content" />
            </div>
        </div>
    )
}

// Debounce utility
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export default NoteEditor
