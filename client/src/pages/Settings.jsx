import { useThemeStore } from '../stores/themeStore'
import { useAuthStore } from '../stores/authStore'
import { Sun, Moon, Palette, Type, User, LogOut, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import './Settings.css'

const colorPresets = [
    { name: 'Indigo', primary: '#6366f1', secondary: '#8b5cf6' },
    { name: 'Blue', primary: '#3b82f6', secondary: '#6366f1' },
    { name: 'Cyan', primary: '#06b6d4', secondary: '#22d3ee' },
    { name: 'Green', primary: '#10b981', secondary: '#34d399' },
    { name: 'Rose', primary: '#f43f5e', secondary: '#ec4899' },
    { name: 'Orange', primary: '#f97316', secondary: '#fb923c' }
]

function Settings() {
    const { theme, colors, fontSize, toggleTheme, setColor, setFontSize, resetTheme } = useThemeStore()
    const { user, logout } = useAuthStore()

    const handleColorPreset = (preset) => {
        setColor('primary', preset.primary)
        setColor('secondary', preset.secondary)
        toast.success(`เปลี่ยนธีมเป็น ${preset.name}`)
    }

    return (
        <div className="settings-page">
            <h1>ตั้งค่า</h1>

            {/* Profile Section */}
            <section className="settings-section glass-card">
                <h2><User size={20} />โปรไฟล์</h2>
                <div className="profile-info">
                    {user?.avatar ? <img src={user.avatar} alt={user.name} className="profile-avatar" /> : <div className="profile-avatar-placeholder"><User size={32} /></div>}
                    <div className="profile-details"><h3>{user?.name || 'ผู้ใช้'}</h3><p>{user?.email}</p></div>
                </div>
                <button className="btn btn-secondary" onClick={() => { logout(); toast.success('ออกจากระบบแล้ว') }}><LogOut size={16} />ออกจากระบบ</button>
            </section>

            {/* Theme Section */}
            <section className="settings-section glass-card">
                <h2><Sun size={20} />ธีม</h2>
                <div className="theme-toggle">
                    <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}><Sun size={18} />สว่าง</button>
                    <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}><Moon size={18} />มืด</button>
                </div>
            </section>

            {/* Colors Section */}
            <section className="settings-section glass-card">
                <h2><Palette size={20} />สีธีม</h2>
                <div className="color-presets">
                    {colorPresets.map(preset => (
                        <button key={preset.name} className="color-preset" onClick={() => handleColorPreset(preset)} title={preset.name}>
                            <span style={{ background: preset.primary }}></span>
                            <span style={{ background: preset.secondary }}></span>
                        </button>
                    ))}
                </div>
                <div className="color-pickers">
                    <div className="color-picker">
                        <label>สีหลัก</label>
                        <input type="color" value={colors.primary} onChange={e => setColor('primary', e.target.value)} />
                    </div>
                    <div className="color-picker">
                        <label>สีรอง</label>
                        <input type="color" value={colors.secondary} onChange={e => setColor('secondary', e.target.value)} />
                    </div>
                    <div className="color-picker">
                        <label>สีพื้นหลัก</label>
                        <input type="color" value={colors.bgPrimary} onChange={e => setColor('bgPrimary', e.target.value)} />
                    </div>
                    <div className="color-picker">
                        <label>สีตัวอักษร</label>
                        <input type="color" value={colors.textPrimary} onChange={e => setColor('textPrimary', e.target.value)} />
                    </div>
                </div>
            </section>

            {/* Font Section */}
            <section className="settings-section glass-card">
                <h2><Type size={20} />ขนาดตัวอักษร</h2>
                <div className="font-size-control">
                    <span className="font-preview" style={{ fontSize: `${fontSize}px` }}>Aa</span>
                    <input type="range" min="12" max="20" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} />
                    <span className="font-value">{fontSize}px</span>
                </div>
            </section>

            {/* Reset Section */}
            <section className="settings-section glass-card">
                <h2><RotateCcw size={20} />รีเซ็ต</h2>
                <p className="section-desc">รีเซ็ตการตั้งค่าธีมทั้งหมดกลับเป็นค่าเริ่มต้น</p>
                <button className="btn btn-secondary" onClick={() => { resetTheme(); toast.success('รีเซ็ตแล้ว') }}><RotateCcw size={16} />รีเซ็ตธีม</button>
            </section>
        </div>
    )
}
export default Settings
