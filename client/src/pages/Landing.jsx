import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
    FileText,
    CheckSquare,
    Calendar,
    Target,
    Bell,
    Palette,
    ArrowRight,
    Chrome
} from 'lucide-react'
import './Landing.css'

function Landing() {
    const navigate = useNavigate()
    const { loginWithGoogle, loginDemo } = useAuthStore()

    const features = [
        {
            icon: FileText,
            title: 'จดโน้ตทุกประเภท',
            description: 'Rich text editor รองรับข้อความ รูปภาพ รายการ และอื่นๆ'
        },
        {
            icon: CheckSquare,
            title: 'จัดการงาน',
            description: 'สร้างรายการงาน กำหนดลำดับความสำคัญ และติดตามความคืบหน้า'
        },
        {
            icon: Calendar,
            title: 'วางแผนชีวิต',
            description: 'ปฏิทินอัจฉริยะ ตารางประชุม และแผนประจำวัน'
        },
        {
            icon: Target,
            title: 'ติดตามเป้าหมาย',
            description: 'ตั้งเป้าหมาย สร้าง milestones และดูความก้าวหน้า'
        },
        {
            icon: Bell,
            title: 'แจ้งเตือนอัจฉริยะ',
            description: 'ไม่พลาดทุกนัดสำคัญด้วยการแจ้งเตือนอัตโนมัติ'
        },
        {
            icon: Palette,
            title: 'ปรับแต่งได้',
            description: 'เลือกสีธีม พื้นหลัง และปรับแต่งตามใจชอบ'
        }
    ]

    return (
        <div className="landing">
            {/* Background Effects */}
            <div className="landing-bg">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>✨ แอพจดโน้ตแห่งอนาคต</span>
                    </div>
                    <h1 className="hero-title">
                        <span className="gradient-text">Kull Note</span>
                        <br />
                        จดโน้ต & วางแผนชีวิต
                    </h1>
                    <p className="hero-subtitle">
                        แอพพลิเคชั่นครบวงจรสำหรับจดโน้ต จัดการงาน วางแผนชีวิต
                        <br />
                        ติดตามเป้าหมาย และอีกมากมาย พร้อมซิงค์ข้อมูลทุกอุปกรณ์
                    </p>

                    <div className="hero-buttons">
                        <button className="btn btn-primary btn-lg" onClick={loginWithGoogle}>
                            <Chrome size={20} />
                            <span>เข้าสู่ระบบด้วย Google</span>
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={loginDemo}>
                            <span>ทดลองใช้งาน</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <div className="stat-value">100%</div>
                            <div className="stat-label">ฟรี</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">∞</div>
                            <div className="stat-label">โน้ต</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">🔒</div>
                            <div className="stat-label">ปลอดภัย</div>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="app-preview glass-card">
                        <div className="preview-header">
                            <div className="preview-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="preview-title">Kull Note</div>
                        </div>
                        <div className="preview-content">
                            <div className="preview-sidebar">
                                <div className="preview-nav-item active"></div>
                                <div className="preview-nav-item"></div>
                                <div className="preview-nav-item"></div>
                                <div className="preview-nav-item"></div>
                            </div>
                            <div className="preview-main">
                                <div className="preview-note">
                                    <div className="preview-line long"></div>
                                    <div className="preview-line medium"></div>
                                    <div className="preview-line short"></div>
                                    <div className="preview-line medium"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-header">
                    <h2>ฟีเจอร์ครบครัน</h2>
                    <p>ทุกสิ่งที่คุณต้องการสำหรับการจัดการชีวิต</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card glass-card">
                            <div className="feature-icon">
                                <feature.icon size={24} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>สร้างด้วย ❤️ โดย Kull Note Team</p>
            </footer>
        </div>
    )
}

export default Landing
