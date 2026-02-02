# 📚 EdVerse - University Management System

A comprehensive university management system built with the MERN stack (MongoDB, Express, React, Node.js).

🚀 **Status:** Production Ready & Deployment Configured  
🎯 **Current Phase:** Phase 3 Complete (Admin Panel + Teacher Management)  
📍 **Deployment:** Ready for Render (Backend) & Vercel (Frontend)

## Features

### Authentication & User Management
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (Student, Teacher, Admin, Moderator, Cafeteria Manager, Librarian)
- ✅ Secure password hashing with bcrypt
- ✅ Password recovery system
- ✅ Protected routes and role-based dashboards

### Planned Features
- 📚 Course management & enrollment
- 📊 Attendance tracking with rubric-based grading
- 🎓 Grades & CGPA calculation (4.0 scale)
- 📅 Timetable/schedule management
- 📝 Assignment submission system
- 📖 Library management with auto-calculated fines
- 🩸 Blood donation registry
- 💬 Complaint & feedback system
- 🍽️ Cafeteria menu & feedback
- 🔔 Real-time notifications (Socket.io)
- 🤖 AI chatbot for FAQs

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for emails (planned)
- Socket.io for real-time features (planned)
- Cloudinary for file uploads (planned)

## Project Structure

```
edVerse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Login, Register, ForgotPassword
│   │   │   └── dashboards/ # Role-based dashboards
│   │   ├── services/       # API services
│   │   └── App.tsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database & app config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── index.ts
│   └── package.json
│
├── shared/                 # Shared types & utilities
│   └── src/
│       └── index.ts        # Grading rubric, types
│
└── package.json           # Root workspace config
```

## Setup Instructions

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB (local or MongoDB Atlas account)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd edVerse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy `server/.env.example` to `server/.env` and update:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/edverse  # Or your MongoDB Atlas URI
   JWT_ACCESS_SECRET=your-strong-secret-here
   JWT_REFRESH_SECRET=your-strong-refresh-secret-here
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB:**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas (cloud) - get connection string from https://cloud.mongodb.com

5. **Run the development servers:**
   
   In separate terminals:
   ```bash
   # Terminal 1 - Backend
   npm run dev --workspace server
   
   # Terminal 2 - Frontend
   npm run dev --workspace client
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Health check: http://localhost:4000/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)

## Default User Roles

When registering, users can select:
- **Student** - Access academic records, courses, grades, library, etc.
- **Teacher** - Manage courses, attendance, grading, materials
- **Admin** - Full system access (must be assigned by another admin)
- **Moderator** - Handle complaints and feedback
- **Cafeteria Manager** - Manage menu and orders
- **Librarian** - Manage books, issues, returns, fines

## Color Palette

- Primary: `#1D546C`
- Primary Dark: `#1A3D64`
- Primary Darker: `#0C2B4E`
- Light Background: `#F4F4F4`

## Development

### Building for Production

```bash
# Build all workspaces
npm run build --workspaces

# Start production server
npm start --workspace server
```

### Linting

```bash
npm run lint --workspaces
```

## 🚀 Deployment Ready!

### Quick Links
- 📖 **Quick Start (15 min):** [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)
- 📚 **Full Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🏗️ **Architecture:** [ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md)

### Live URLs (After Deployment)
```
Frontend:  https://edverse.vercel.app
Backend:   https://edverse-server.onrender.com
Admin:     https://edverse.vercel.app/admin
```

### Configuration Files Created ✅
- ✅ `render.yaml` - Render backend configuration
- ✅ `vercel.json` - Vercel frontend configuration  
- ✅ `.env.example` - Environment variables template
- ✅ `deploy.sh` - Unix deployment script
- ✅ `deploy.bat` - Windows deployment script

### Admin Credentials
```
Email: admin@edverse.com
Password: admin123
```

---

## 🏛️ Admin Panel Features

### Implemented ✅
- Admin Dashboard with 4 charts + 5 stat cards
- Teacher Management (CRUD + Auto ID + Auto Password)
- Teacher Detail Modal with bulk CSV upload
- Admin Profile & Settings pages
- Protected routes & role-based access

### Ready for Implementation
- Student Management System
- Course Management System
- Attendance Tracking
- Grading System
- Additional modules (Phases 4-13)

---

## Roadmap

- [x] Authentication system
- [x] Role-based dashboards
- [x] Admin Panel Infrastructure (Phase 1)
- [x] Dashboard Analytics (Phase 2)
- [x] Teacher Management (Phase 3)
- [x] Deployment Configuration ✨
- [ ] Student Management (Phase 4)
- [ ] Course Management (Phase 5)
- [ ] Attendance tracking
- [ ] Grade & CGPA system
- [ ] Assignment submission
- [ ] Library management
- [ ] Blood donation system
- [ ] Complaint system
- [ ] Cafeteria management
- [ ] Real-time notifications
- [ ] AI chatbot
- [ ] Email notifications

## 📊 Project Statistics

- **Lines of Code:** 16,685+
- **Components Created:** 20+
- **API Endpoints:** 40+
- **Database Models:** 10+
- **Pages Implemented:** 8+
- **Git Commits:** 60+

## License

MIT

## Contributors

Built with ❤️ for university management
