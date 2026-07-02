# Student Management System

ระบบจัดการข้อมูลนักศึกษาแบบ Full Stack

## 🛠️ Technology Stack

### Frontend
- React.js 18+
- Tailwind CSS
- Axios
- React Router
- Chart.js / Recharts

### Backend
- Node.js
- Express.js
- JWT Authentication
- MySQL
- Multer (File Upload)
- XLSX Parser

### Database
- MySQL 8.0+

## 📋 Project Structure

```
student-management-system/
├── frontend/                 # React.js Application
│   ├── src/
│   │   ├── components/      # Reusable Components
│   │   ├── pages/           # Page Components
│   │   ├── services/        # API Services
│   │   ├── utils/           # Utilities
│   │   ├── context/         # Context API
│   │   ├── styles/          # Global Styles
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Node.js + Express.js
│   ├── src/
│   │   ├── routes/          # API Routes
│   │   ├── controllers/     # Controllers
│   │   ├── models/          # Database Models
│   │   ├── middleware/      # Middleware (Auth, etc)
│   │   ├── config/          # Configuration
│   │   ├── utils/           # Utilities
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql           # Database Schema
│   └── seeds.sql            # Sample Data
└── README.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ✨ Features
- ✅ JWT Authentication
- ✅ Student Registration & Login
- ✅ Admin Dashboard
- ✅ Student Management
- ✅ Curriculum Management
- ✅ Excel Import
- ✅ Analytics & Reports
- ✅ Responsive Design
