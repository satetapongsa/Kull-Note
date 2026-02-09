# WebNote - จดโน้ต & วางแผนชีวิต

แอพพลิเคชั่นจดโน้ตและวางแผนชีวิตครบวงจร คล้าย Notion

## ✨ Features

- 📝 **จดโน้ต** - Rich text editor รองรับข้อความ รูปภาพ รายการ
- ✅ **จัดการงาน** - สร้าง task, subtasks, กำหนดลำดับความสำคัญ
- 📅 **ปฏิทิน** - ดูตารางงานและกิจกรรมทั้งหมด
- 🎯 **เป้าหมาย** - ตั้งเป้าหมายและติดตามความก้าวหน้า
- 🎨 **งานอดิเรก** - บันทึกและติดตามงานอดิเรก
- 🔔 **แจ้งเตือน** - Browser notifications เมื่อถึงเวลา
- 🎨 **ปรับแต่งธีม** - เลือกสีพื้นหลังและตัวอักษรได้
- 🔐 **Google Login** - เก็บข้อมูลปลอดภัยด้วย Google Account

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Setup Environment

```bash
# Copy example env file
cd server
cp .env.example .env
# แก้ไข .env ใส่ค่าต่างๆ
```

### 3. Run Development Server

```bash
# Terminal 1 - Run frontend
cd client
npm run dev

# Terminal 2 - Run backend (optional - ใช้ demo mode ได้โดยไม่ต้อง backend)
cd server
npm run dev
```

### 4. Open Browser

เปิด http://localhost:5173

## 🛠️ Tech Stack

### Frontend
- React + Vite
- React Router
- TipTap Editor
- FullCalendar
- Zustand (State Management)
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Google OAuth)

## 📁 Project Structure

```
web note all/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page Components
│   │   ├── stores/         # Zustand Stores
│   │   └── styles/         # CSS Files
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/             # Configuration
│   ├── models/             # MongoDB Models
│   ├── routes/             # API Routes
│   ├── middleware/         # Express Middleware
│   └── package.json
│
└── README.md
```

## 🔐 Google OAuth Setup

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้าง Project ใหม่
3. ไปที่ APIs & Services > Credentials
4. สร้าง OAuth 2.0 Client ID
5. เพิ่ม Authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID และ Secret ไปใส่ใน `.env`

## 📱 Demo Mode

แอพสามารถใช้งาน **Demo Mode** ได้โดยไม่ต้อง setup backend:
- คลิก "ทดลองใช้งาน" ที่หน้า Landing
- ข้อมูลจะเก็บใน Local Storage ของ Browser

## 📄 License

MIT License
