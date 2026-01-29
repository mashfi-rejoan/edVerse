# edVerse - Live Feature Access Guide

## ✅ Backend API (Running on http://localhost:4000)

All API endpoints are now live and accessible:

### Shared Modules
- **GET/POST** `/api/shared/complaints` - Submit and view complaints
- **GET/POST** `/api/shared/library` - Access library resources

### Blood Donation
- **GET** `/api/blood-donation` - View all donors
- **POST** `/api/blood-donation` - Register as donor
- **GET** `/api/blood-donation/available/:bloodType` - Find donors by blood type
- **PATCH** `/api/blood-donation/:id` - Update donation status

### Cafeteria
- **GET** `/api/cafeteria` - View menu items
- **GET** `/api/cafeteria/category/:category` - Filter by category
- **POST** `/api/cafeteria` - Add menu item (manager only)
- **POST** `/api/cafeteria/:id/review` - Add review
- **PATCH** `/api/cafeteria/:id` - Update item

### Chatbot
- **GET** `/api/chatbot/user/:userId` - Get chat history
- **POST** `/api/chatbot/message` - Send message
- **PATCH** `/api/chatbot/:id/resolve` - Mark resolved

### Notifications
- **GET** `/api/notifications/user/:userId` - Get notifications
- **GET** `/api/notifications/user/:userId/unread` - Count unread
- **POST** `/api/notifications` - Create notification
- **PATCH** `/api/notifications/:id/read` - Mark as read

### Analytics
- **GET** `/api/analytics/feature/:featureName` - Feature analytics
- **GET** `/api/analytics` - All analytics with filters
- **GET** `/api/analytics/dashboard/summary` - Dashboard summary
- **POST** `/api/analytics` - Record event

### Moderation
- **GET** `/api/moderation/pending` - Pending items
- **GET** `/api/moderation/type/:itemType` - By type
- **POST** `/api/moderation` - Submit for moderation
- **PATCH** `/api/moderation/:id/approve` - Approve
- **PATCH** `/api/moderation/:id/reject` - Reject

### Google Classroom (Placeholder)
- **GET** `/api/google-classroom/sync` - Sync data
- **POST** `/api/google-classroom/import-announcements` - Import
- **POST** `/api/google-classroom/export-resources` - Export

---

## ✅ Frontend Routes (Running on http://localhost:5173)

### Authentication
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery

### Student Routes
- `/student` - **Student Dashboard** with courses, attendance, CGPA
- `/student/library` - **Library Module** - Browse and borrow books
- `/student/complaints` - **Complaints Module** - Submit and track complaints
- `/student/blood` - **Blood Donation** - View donors, filter by blood type

### Teacher Routes
- `/teacher` - **Teacher Dashboard** - Manage classes and assignments

### Admin Routes
- `/admin` - **Admin Dashboard** - User management, platform stats

### Moderator Routes
- `/moderator` - **Moderator Dashboard** - Approve/reject content

### Cafeteria Manager Routes
- `/cafeteria-manager` - **Cafeteria Dashboard** - Manage menu, view feedback

### Librarian Routes
- `/librarian` - **Librarian Dashboard** - Manage inventory, track books

---

## 🎯 How to Access Features

### As a Student:
1. Login at http://localhost:5173/login
2. Navigate using the sidebar menu:
   - **Dashboard** - Home view
   - **Library** - Browse available books
   - **Complaints** - Submit and track complaints
   - **Blood Donation** - View available donors
3. **Chatbot** - Click the blue chat icon in bottom-right corner

### As a Teacher:
1. Login with teacher credentials
2. Access teacher-specific features:
   - Manage classes
   - Create assignments
   - Post announcements

### As an Admin:
1. Login with admin credentials
2. Access admin panel:
   - User management
   - Platform statistics
   - System health monitoring

### As a Moderator:
1. Login with moderator credentials
2. Review pending items:
   - Approve/reject complaints
   - Moderate resources
   - Handle events

### As Cafeteria Manager:
1. Login with manager credentials
2. Manage cafeteria:
   - Add/update menu items
   - View customer reviews
   - Track sales

### As Librarian:
1. Login with librarian credentials
2. Manage library:
   - Add new books
   - Track borrowed items
   - View inventory stats

---

## 🚀 Features Now Live:

✅ **Navigation Sidebar** - Role-based menu items
✅ **Library Module** - Full book browsing with search
✅ **Complaints System** - Submit and track complaints
✅ **Blood Donation Registry** - Filter donors by blood type
✅ **Chatbot Widget** - Interactive support chat (bottom-right)
✅ **All Dashboards** - Student, Teacher, Admin, Moderator, Cafeteria Manager, Librarian
✅ **API Integration** - All modules connected to backend
✅ **Responsive Design** - Mobile-friendly with Tailwind CSS

---

## 📝 Test the Features:

1. **Library**: Go to `/student/library` to see books from the database
2. **Complaints**: Go to `/student/complaints` to submit a new complaint
3. **Blood Donation**: Go to `/student/blood` to view donors by blood type
4. **Chatbot**: Click the 💬 icon to start a conversation
5. **Dashboards**: Access different role dashboards using the URLs above

---

## 🔧 Still Need Setup:

- Test data population (add books, complaints, donors to database)
- User authentication with different roles
- Real-time notifications via WebSockets
- Google Classroom OAuth integration
- Advanced chatbot AI responses

---

## 📍 Quick Access:
- **Website**: http://localhost:5173
- **API Health**: http://localhost:4000/api/health
- **API Base**: http://localhost:4000/api
