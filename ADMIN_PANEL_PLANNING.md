# Admin Panel - Complete Architectural Design Document

**Project:** edVerse Admin Panel for BSc CSE Program
**Status:** Planning & Architecture
**Date:** February 3, 2026
**Scope:** Single Department (CSE), Single Program (BSc)

---

## SECTION 1: PROJECT OVERVIEW & GOALS

### 1.1 Objectives
- Centralized management of CSE BSc program
- Teacher course assignment and routine management
- Registration portal control
- Academic calendar management
- Exam scheduling and monitoring
- Complaint/issue management
- Complete audit trail and reporting

### 1.2 Target Users
- Super Admin (Full system access)
- Department Admin (CSE department level)
- Support Staff (Limited access - complaints, announcements)

### 1.3 Key Principles
- **Consistency**: Same color scheme, typography, spacing as student/teacher panels
- **Simplicity**: Complex features presented in user-friendly manner
- **Security**: Role-based access control (RBAC)
- **Performance**: Fast loading, minimal API calls
- **Scalability**: Structure ready for future multi-department expansion

---

## SECTION 2: DESIGN SYSTEM & THEME CONSISTENCY

### 2.1 Color Palette (Match Existing)
```
Primary: #0C2B4E (Dark Blue) - Headers, CTAs
Secondary: #1A3D64 (Medium Blue) - Hover states
Accent: #1D546C (Teal) - Active states
Red: #EF4444 (Error, Danger)
Green: #10B981 (Success)
Yellow: #F59E0B (Warning)
Gray: #6B7280 (Text), #F3F4F6 (Backgrounds)
```

### 2.2 Typography
- Headings: Bold, larger sizes (h1: 28px, h2: 20px, h3: 16px)
- Body: Regular, 14px
- Labels: Semibold, 12px

### 2.3 Components to Reuse
- Card layouts (white bg, border, shadow-sm)
- Button styles (primary, secondary, danger)
- Modal patterns
- Sidebar navigation
- Top header bar
- Info cards with icons
- Gradient headers (like teacher/student panels)

### 2.4 Layout Structure
```
Admin Panel Structure:
├── Sidebar (Fixed, left)
│   ├── Logo/Branding
│   ├── Main Navigation
│   ├── Bottom Panel (Profile + Settings + Logout)
│   └── Collapsible
│
├── Header (Top)
│   ├── Page Title
│   ├── Breadcrumb
│   ├── Search
│   └── Notifications
│
└── Main Content Area
    ├── Gradient Header (with icon)
    ├── Content Sections
    ├── Tables/Lists
    └── Forms/Modals
```

---

## SECTION 3: DATABASE SCHEMA DESIGN

### 3.1 Core Collections (MongoDB)

#### **1. Users Collection**
```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String,
  email: String (unique),
  password: String (hashed),
  universityId: String (unique),
  phone: String,
  
  // Role & Department
  role: 'student' | 'teacher' | 'admin' | 'support',
  department: 'CSE',
  
  // Status
  status: 'active' | 'inactive' | 'suspended',
  createdAt: Date,
  updatedAt: Date,
  
  // For Teachers only
  designation: String,
  specialization: String,
  
  // For Students only
  batch: Number, // 2024, 2025...
  section: 'A' | 'B' | 'C',
  admissionDate: Date,
  
  // For Admin
  accessLevel: 'super' | 'department',
  permissions: [String]
}
```

#### **2. Courses Collection**
```javascript
{
  _id: ObjectId,
  courseCode: String (unique), // CSE101
  courseName: String, // Data Structures
  creditHours: Number, // 3
  semester: Number, // 1-8
  department: 'CSE',
  
  // Offering details
  isOffering: Boolean,
  offeringYear: Number, // 2026
  offeringBatch: Number, // 2024
  
  // Prerequisites
  prerequisites: [ObjectId], // references to other courses
  
  // Description
  description: String,
  syllabus: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. Course Sections Collection**
```javascript
{
  _id: ObjectId,
  courseId: ObjectId, // reference to course
  section: 'A' | 'B' | 'C', // which student section
  
  // Teacher Assignment
  teacherId: ObjectId, // which teacher teaches
  
  // Schedule
  schedule: [
    {
      day: 'Monday' | 'Tuesday'...,
      startTime: '09:00',
      endTime: '10:30',
      room: '204',
      building: 'Building A'
    }
  ],
  
  // Capacity
  enrolledStudents: Number,
  maxCapacity: Number,
  students: [ObjectId], // enrolled student IDs
  
  // Academic info
  academicYear: 2026,
  semester: 'Spring' | 'Fall',
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. Registration Collection**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  courseSectionId: ObjectId,
  
  // Status
  status: 'registered' | 'dropped' | 'pending',
  registrationDate: Date,
  
  // Grades (filled after semester ends)
  finalGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' | null,
  gpa: Number,
  
  // Attendance
  totalClasses: Number,
  attendedClasses: Number,
  attendancePercentage: Number,
  
  academicYear: 2026,
  semester: 'Spring',
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **5. Academic Calendar Collection**
```javascript
{
  _id: ObjectId,
  
  academicYear: 2026,
  semester: 'Spring' | 'Fall',
  
  // Important Dates
  semesterStartDate: Date,
  semesterEndDate: Date,
  classStartDate: Date,
  classEndDate: Date,
  
  // Registration Period
  registrationStartDate: Date,
  registrationEndDate: Date,
  lateRegistrationStartDate: Date,
  lateRegistrationEndDate: Date,
  
  // Drop/Add Period
  dropAddStartDate: Date,
  dropAddEndDate: Date,
  
  // Exam Period
  midtermStartDate: Date,
  midtermEndDate: Date,
  finalStartDate: Date,
  finalEndDate: Date,
  
  // Grade Submission
  gradeSubmissionDeadline: Date,
  
  // Holidays
  holidays: [
    {
      date: Date,
      reason: String
    }
  ],
  
  // Status
  isActive: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **6. Exam Schedule Collection**
```javascript
{
  _id: ObjectId,
  
  academicYear: 2026,
  semester: 'Spring',
  examType: 'midterm' | 'final',
  
  courseSectionId: ObjectId,
  
  // Exam Details
  examDate: Date,
  startTime: String, // '10:00'
  endTime: String,   // '12:00'
  room: String,
  building: String,
  invigilator: ObjectId, // teacher ID
  
  // Seating
  totalSeats: Number,
  enrolledStudents: Number,
  
  status: 'scheduled' | 'completed' | 'cancelled',
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **7. Complaint Collection**
```javascript
{
  _id: ObjectId,
  
  // Who is complaining
  submittedBy: ObjectId, // student ID
  submittedByRole: 'student' | 'teacher',
  
  // Complaint Details
  title: String,
  description: String,
  category: 'academic' | 'facility' | 'conduct' | 'other',
  
  // Attachment
  attachments: [String], // file URLs
  
  // Status
  status: 'open' | 'in-progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  
  // Assignment
  assignedTo: ObjectId, // staff member
  
  // Resolution
  resolution: String,
  resolvedDate: Date,
  
  // Tracking
  createdAt: Date,
  updatedAt: Date,
  comments: [
    {
      userId: ObjectId,
      message: String,
      timestamp: Date
    }
  ]
}
```

#### **8. Announcement Collection**
```javascript
{
  _id: ObjectId,
  
  // Content
  title: String,
  description: String,
  content: String, // HTML/Rich text
  
  // Scope
  scope: 'all' | 'students' | 'teachers' | 'department',
  targetBatch: Number, // if specific batch
  targetSection: String, // if specific section
  
  // Attachment
  attachments: [String], // file URLs
  
  // Publishing
  publishedBy: ObjectId, // admin ID
  publishDate: Date,
  expiryDate: Date,
  
  // Status
  status: 'draft' | 'published' | 'archived',
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **9. Room/Resource Collection**
```javascript
{
  _id: ObjectId,
  
  roomNumber: String, // '204'
  building: String,   // 'Building A'
  
  // Details
  capacity: Number,
  type: 'classroom' | 'lab' | 'auditorium',
  equipment: [String], // ['projector', 'whiteboard', 'AC']
  
  // Status
  status: 'available' | 'under-maintenance',
  
  // Bookings (denormalized for quick lookup)
  bookings: [
    {
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      courseSectionId: ObjectId
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **10. Room Booking Request Collection**
```javascript
{
  _id: ObjectId,
  
  // Request Details
  requestedBy: ObjectId, // teacher ID
  requestDate: Date,
  
  // Room Info
  roomId: ObjectId,
  
  // Booking Details
  bookingDate: Date,
  startTime: String,
  endTime: String,
  reason: String,
  
  // Status
  status: 'pending' | 'approved' | 'rejected',
  approvedBy: ObjectId, // admin ID
  approvalDate: Date,
  rejectionReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **11. System Logs Collection (Audit Trail)**
```javascript
{
  _id: ObjectId,
  
  // Action Details
  action: String, // 'course_created', 'teacher_assigned', etc
  module: String, // 'courses', 'teachers', 'registrations'
  
  // Who did it
  performedBy: ObjectId,
  userRole: String,
  
  // What changed
  oldData: Object,
  newData: Object,
  
  // When
  timestamp: Date,
  ipAddress: String
}
```

### 3.2 Database Relationships
```
User (teachers) ──1──→ N── Course Sections
                             ↓
                        Registrations ←── Users (students)
                             ↓
                        Exam Schedule
                        
Courses ──1──→ N── Course Sections

Academic Calendar ──1──→ N── Exam Schedule

Announcements ──1──→ many── Users (viewing)

Room ──1──→ N── Room Bookings
Room ──1──→ N── Course Sections (schedule)

Complaints ──1──→ N── Comments

System Logs (tracks all actions)
```

---

## SECTION 4: ADMIN PANEL FEATURE BREAKDOWN

### 4.1 Dashboard (Main Landing Page)

**Components:**
1. **Welcome Header** - Current semester info, quick stats
2. **Quick Stats Cards:**
   - Total Students (This Batch)
   - Total Teachers (CSE)
   - Active Courses (This Semester)
   - Pending Approvals (Room bookings, complaints)
   - Up-Coming Events (Next 7 days)

3. **Charts & Graphs:**
   - Course enrollment by section
   - Student performance (average GPA)
   - Attendance overview (average %)
   - Complaint resolution rate

4. **Recent Activities Feed:**
   - New registrations (last 5)
   - Recent room booking requests
   - New complaints
   - Grade submissions

5. **Pending Actions Box:**
   - Room booking approvals
   - Complaint assignments
   - Grades pending submission
   - Announcements to be published

**Task Log:**
- [ ] Design welcome section
- [ ] Create stats card components
- [ ] Build chart visualizations
- [ ] Create activity feed UI
- [ ] Setup real-time data loading

---

### 4.2 User Management Module

#### **4.2.1 Teacher Management**

**Page: /admin/teachers**

**Features:**
1. **Teacher List View**
   - Table with: Name, ID, Department, Designation, Courses Assigned, Status
   - Search by name/ID
   - Filter by: Status, Designation
   - Sort by: Name, Courses, Active

2. **Add New Teacher** (Modal/Page)
   - Form fields: Name, Email, Phone, Designation, Specialization
   - Generate Auto-ID
   - Password auto-generation
   - Bulk upload CSV

3. **Teacher Detail View**
   - Full profile info
   - Courses assigned (current semester)
   - Routine/schedule
   - Student feedback ratings
   - Attendance trends (classes conducted)
   - Edit button
   - Disable/Reactivate button

4. **Edit Teacher**
   - Update designation, specialization
   - Change department (if needed)
   - Password reset
   - Status change

**Task Log:**
- [ ] Design teacher list table
- [ ] Create teacher form components
- [ ] Build teacher detail view
- [ ] Implement search/filter/sort
- [ ] Create bulk upload feature
- [ ] Add edit functionality
- [ ] Create data export (CSV)

#### **4.2.2 Student Management**

**Page: /admin/students**

**Features:**
1. **Student List View**
   - Table: Name, ID, Section, Batch, Registered Courses, Attendance, Status
   - Filter by: Batch, Section, Status
   - Search by name/ID
   - Sort options

2. **Add New Student** (Batch Upload Primary)
   - CSV template: Name, ID, Section, Batch, Email, Phone
   - Validation before upload
   - Duplicate check
   - Auto-assign to sections

3. **Student Detail View**
   - Personal info
   - Registered courses (with grades if available)
   - Attendance across courses
   - Overall GPA
   - Academic standing (good/warning/probation)
   - Activity log

4. **Student Status Management**
   - Activate/Deactivate account
   - Graduate student
   - Suspend account

**Task Log:**
- [ ] Design student list table
- [ ] Create bulk upload CSV handler
- [ ] Build student detail view
- [ ] Create status management UI
- [ ] Implement filters/search
- [ ] Build academic standing logic
- [ ] Create student export feature

---

### 4.3 Academic Management Module

#### **4.3.1 Courses Management**

**Page: /admin/courses**

**Features:**
1. **Courses List**
   - All CSE courses (CSE101-CSE499)
   - Table: Code, Name, Credits, Semester, Offering Status
   - Filter by semester
   - Search

2. **Add/Edit Course**
   - Form: Code, Name, Credits, Semester, Prerequisites, Description
   - Cannot delete if sections exist
   - Archive unused courses

3. **Offering Management**
   - Mark courses for current offering
   - Select: Academic Year, Semester, Batches to offer
   - Set max students per section

**Task Log:**
- [ ] Design course list
- [ ] Create course form
- [ ] Build course offering interface
- [ ] Create prerequisite selection
- [ ] Build course archive feature

#### **4.3.2 Course Sections (Class Assignment)**

**Page: /admin/course-sections**

**Features:**
1. **Create Course Sections**
   - From offerings, auto-create sections (A, B, C based on enrollment)
   - Assign teachers to sections
   - Set maximum capacity

2. **Section Management**
   - View all sections
   - Assigned teacher, enrolled students count
   - Edit teacher assignment
   - View enrolled students
   - Change capacity

3. **Teacher Assignment Interface**
   - Drag-drop or dropdown to assign teacher
   - Check teacher workload (prevent overload)
   - Unassign if needed

**Task Log:**
- [ ] Design section list UI
- [ ] Create section creation form
- [ ] Build teacher assignment interface
- [ ] Implement workload checking
- [ ] Create capacity management
- [ ] Build student enrollment list view

#### **4.3.3 Routine/Schedule Management**

**Page: /admin/routine**

**Features:**
1. **Weekly Routine View**
   - Calendar grid (Mon-Fri, Time slots)
   - Show all classes
   - Color-coded by section
   - Room assignments

2. **Add/Edit Schedule**
   - Select course section
   - Pick day, time, room
   - Auto-check for conflicts
   - Bulk schedule import

3. **Conflict Detection**
   - Room conflicts
   - Teacher double-booking
   - Student conflicts (same student in two classes)
   - Display warnings before saving

4. **Schedule Reports**
   - Per course section
   - Per teacher
   - Per room
   - Export to PDF/Excel

**Task Log:**
- [ ] Design calendar/grid UI
- [ ] Create schedule form
- [ ] Build conflict detection algorithm
- [ ] Create bulk import feature
- [ ] Build schedule export/PDF
- [ ] Create various report views

---

### 4.4 Registration & Enrollment Module

#### **4.4.1 Registration Portal Control**

**Page: /admin/registration-settings**

**Features:**
1. **Registration Window Management**
   - Set opening date/time
   - Set closing date/time
   - Set late registration period (if allowed)
   - Status: Not Started / Active / Closed
   - Preview: "Portal opens on XX date"

2. **Registration Rules**
   - Min/Max credits per semester
   - Prerequisites enforcement (yes/no)
   - Co-requisites
   - GPA requirements (if any)

3. **Capacity Management**
   - Set max students per section
   - Auto-section creation threshold
   - Waitlist settings (if any)

4. **Testing/Preview**
   - Test mode for registration
   - View as student
   - Validate constraints

**Task Log:**
- [ ] Design registration settings form
- [ ] Create date/time picker components
- [ ] Build rule editor interface
- [ ] Create validation logic display
- [ ] Build test mode interface
- [ ] Create countdown timer component

#### **4.4.2 Registrations Oversight**

**Page: /admin/registrations**

**Features:**
1. **View All Registrations**
   - Semester filter
   - Section filter
   - Batch filter
   - Statistics: Total, Pending, Completed

2. **Per-Student View**
   - Which courses they registered for
   - Status (registered/dropped)
   - Credits taken
   - Validation issues

3. **Drop/Add Management**
   - See pending drops
   - Approve/reject drop requests
   - Reason tracking

4. **Bulk Operations**
   - Export registration data (CSV/Excel)
   - Generate enrollment reports
   - Send notifications

**Task Log:**
- [ ] Design registrations list view
- [ ] Create detailed registration inspector
- [ ] Build drop request handling UI
- [ ] Create bulk export feature
- [ ] Build report generation
- [ ] Create notification sender

---

### 4.5 Academic Calendar Module

**Page: /admin/academic-calendar**

**Features:**
1. **Calendar Setup Form**
   - Academic year (2026, 2027...)
   - Semester (Spring, Fall)
   - Class start/end dates
   - Registration period
   - Drop/add period
   - Midterm exam dates
   - Final exam dates
   - Grade submission deadline
   - Holiday dates/reasons

2. **Calendar Visualization**
   - Month view showing all dates
   - Color-coded events
   - Edit any date
   - Clone previous semester

3. **Active Calendar Indicator**
   - Mark which semester is active
   - Students see current semester
   - Teachers see current calendar

**Task Log:**
- [ ] Design calendar form
- [ ] Create date input components
- [ ] Build calendar visualization
- [ ] Create clone feature
- [ ] Build holiday management
- [ ] Create calendar export (ICS)

---

### 4.6 Exam Management Module

#### **4.6.1 Exam Schedule Setup**

**Page: /admin/exam-schedule**

**Features:**
1. **Create Exam Schedule**
   - Select semester
   - Select exam type (midterm/final)
   - Date range
   - Time slots available
   - Room assignment rules

2. **Bulk Schedule Generation**
   - Auto-assign dates/times
   - Auto-assign rooms based on capacity
   - Prevent conflicts
   - Export schedule

3. **Manual Adjustments**
   - Drag-drop exams to different slots
   - Change rooms
   - Adjust timing
   - Add invigilators

4. **Publish Schedule**
   - Preview before publishing
   - Lock schedule
   - Send to students/teachers
   - Display on student dashboard

**Task Log:**
- [ ] Design exam schedule form
- [ ] Create bulk generation logic
- [ ] Build drag-drop interface
- [ ] Create conflict resolution UI
- [ ] Build schedule publishing
- [ ] Create student/teacher notifications

#### **4.6.2 Grade Submission Tracking**

**Page: /admin/grade-submission**

**Features:**
1. **Submission Status View**
   - Which teachers have submitted grades
   - Which haven't (overdue)
   - Course section wise view
   - Days remaining

2. **Grade Sheet Viewer**
   - View submitted grades
   - Download grade report
   - Verify grade distribution (A+: 10%, A: 20%... rule checking)

3. **Reminders**
   - Auto-send reminders to late teachers
   - Manual reminder button
   - Change deadline if needed

4. **Grade Approval** (Optional)
   - View and approve grades
   - Flag suspicious distributions
   - Lock grades once approved
   - Publish grades to students

**Task Log:**
- [ ] Design submission tracker UI
- [ ] Create status indicators
- [ ] Build grade report viewer
- [ ] Create reminder system
- [ ] Build grade approval workflow
- [ ] Create grade distribution analyzer

---

### 4.7 Routine & Schedule Module

**Page: /admin/routine** (Already covered in 4.3.3, more detail here)

**Features:**
1. **Weekly Schedule Grid**
   - Time slots: 08:00-17:00
   - Rooms as columns
   - Color by course section
   - Hover to see details

2. **Bulk Schedule Upload**
   - CSV format: Course Code, Section, Day, Time, Room
   - Validation
   - Preview before upload
   - Conflict checking

3. **Individual Schedule Management**
   - Add/Edit/Delete individual class
   - Change time/room
   - Reschedule if needed

4. **Student/Teacher View**
   - What students see (their personal routine)
   - What teachers see (their courses)
   - Export to personal calendar (ICS)

**Task Log:** (Already listed in 4.3.3)

---

### 4.8 Room & Resource Management

**Page: /admin/rooms**

**Features:**
1. **Room Inventory**
   - List all rooms
   - Capacity, type, equipment
   - Current usage
   - Maintenance status
   - Search/filter

2. **Booking Request Management**
   - View pending requests
   - Approve/reject with reason
   - View booking history
   - Conflict detection

3. **Room Availability Calendar**
   - Visual calendar showing bookings
   - Drag-drop to reassign
   - Color by course
   - Time-slot view

**Task Log:**
- [ ] Design room list UI
- [ ] Create booking request handler
- [ ] Build room availability calendar
- [ ] Create conflict checker
- [ ] Build bulk room assignment
- [ ] Create room maintenance tracker

---

### 4.9 Complaint Management Module

**Page: /admin/complaints**

**Features:**
1. **Complaint Dashboard**
   - Pending complaints (Count, Oldest first)
   - Statistics: Open, In Progress, Resolved
   - Priority distribution
   - Average resolution time

2. **Complaint List**
   - Filter by: Status, Priority, Category, Assignee
   - Search by title/submitter
   - Sort options

3. **Complaint Detail View**
   - Full complaint info
   - Submitted by (student/teacher)
   - Description, attachments
   - Timeline/comments
   - Assign to staff
   - Add resolution
   - Change priority
   - Close complaint

4. **Assignment Workflow**
   - Auto-assign or manual
   - Reassign if needed
   - Track assignment history

**Task Log:**
- [ ] Design complaint dashboard
- [ ] Create complaint list UI
- [ ] Build complaint detail view
- [ ] Create assignment workflow
- [ ] Build comment system
- [ ] Create resolution tracker
- [ ] Build complaint analytics

---

### 4.10 Announcements & Communication

**Page: /admin/announcements**

**Features:**
1. **Announcement Management**
   - Create new announcement
   - Rich text editor (HTML/Markdown)
   - File attachments
   - Schedule publishing (draft, publish, archive)
   - Set expiry date

2. **Scope Management**
   - All students & teachers
   - Only students
   - Only teachers
   - Specific batch/section
   - Specific course

3. **Announcement List**
   - View all announcements
   - Status: Draft, Published, Archived
   - Edit/Delete (only if draft)
   - View responses/acknowledgments

4. **Notification Trigger**
   - Send email/SMS on publish
   - In-app notifications
   - Pin to top (sticky)

**Task Log:**
- [ ] Design announcement form
- [ ] Create rich text editor
- [ ] Build scope selector
- [ ] Create announcement list UI
- [ ] Build notification system
- [ ] Create announcement analytics

---

### 4.11 Reports & Analytics

**Page: /admin/reports**

**Features:**
1. **Available Reports:**
   - Enrollment report (by course, by section, by batch)
   - Attendance report (by course, by student, trends)
   - Academic performance (avg GPA by course, by section)
   - Complaint statistics (resolved rate, avg time to resolve)
   - Registration statistics (how many per course)
   - Exam statistics (average grades, grade distribution)
   - Teacher workload (courses per teacher)
   - Room utilization (which rooms most used)

2. **Report Generation**
   - Select report type
   - Select filters (semester, batch, section, etc)
   - Generate/Export (PDF, Excel, CSV)
   - Schedule automated reports

3. **Data Visualization**
   - Charts for each report
   - Comparative analysis
   - Trend lines
   - Export visualizations

**Task Log:**
- [ ] Design report selection UI
- [ ] Create report builder
- [ ] Build chart components
- [ ] Create export functionality
- [ ] Build automated reporting
- [ ] Create analytics dashboard

---

### 4.12 System Settings & Configuration

**Page: /admin/settings**

**Features:**
1. **General Settings**
   - University name, logo
   - Current academic year/semester
   - Department info (for CSE)

2. **User Management Settings**
   - Password policy (complexity requirements)
   - Session timeout
   - Failed login attempts

3. **System Maintenance**
   - Database backup schedule
   - Activity logs view/cleanup
   - System health check

4. **Email Settings** (For notifications)
   - SMTP server config
   - Email templates
   - Test email send

5. **Backup & Restore**
   - Last backup date
   - Manual backup trigger
   - Restore options

**Task Log:**
- [ ] Design settings interface
- [ ] Create config form components
- [ ] Build backup/restore UI
- [ ] Create email testing
- [ ] Build activity logs viewer
- [ ] Create system health monitor

---

### 4.13 Admin Activity Logs (Audit Trail)

**Page: /admin/logs**

**Features:**
1. **Activity Log View**
   - All admin actions logged
   - Filter by: Action type, Date range, Admin user
   - Search by module

2. **Log Details**
   - What changed (before/after)
   - Who did it
   - When
   - IP address

3. **Log Export**
   - Download logs (CSV)
   - Generate audit reports

**Task Log:**
- [ ] Design logs UI
- [ ] Create log filtering
- [ ] Build log viewer
- [ ] Create export functionality
- [ ] Build automated logging system

---

## SECTION 5: FRONTEND ARCHITECTURE

### 5.1 Folder Structure
```
client/src/
├── features/
│   ├── admin-dashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── Charts.tsx
│   │
│   ├── admin-users/
│   │   ├── AdminUsers.tsx
│   │   ├── TeacherManagement.tsx
│   │   ├── StudentManagement.tsx
│   │   └── components/
│   │       ├── TeacherForm.tsx
│   │       ├── TeacherList.tsx
│   │       ├── StudentBulkUpload.tsx
│   │       └── StudentList.tsx
│   │
│   ├── admin-courses/
│   │   ├── AdminCourses.tsx
│   │   ├── CourseManagement.tsx
│   │   ├── SectionManagement.tsx
│   │   └── components/
│   │       ├── CourseForm.tsx
│   │       ├── CourseList.tsx
│   │       ├── SectionForm.tsx
│   │       └── TeacherAssignment.tsx
│   │
│   ├── admin-routine/
│   │   ├── AdminRoutine.tsx
│   │   └── components/
│   │       ├── ScheduleGrid.tsx
│   │       ├── ScheduleForm.tsx
│   │       └── ConflictDetector.tsx
│   │
│   ├── admin-registration/
│   │   ├── RegistrationPortal.tsx
│   │   ├── RegistrationSettings.tsx
│   │   ├── RegistrationOversight.tsx
│   │   └── components/
│   │       ├── RegistrationForm.tsx
│   │       ├── RegistrationList.tsx
│   │       └── RulesEditor.tsx
│   │
│   ├── admin-calendar/
│   │   ├── AcademicCalendar.tsx
│   │   └── components/
│   │       ├── CalendarForm.tsx
│   │       └── CalendarVisualization.tsx
│   │
│   ├── admin-exams/
│   │   ├── ExamSchedule.tsx
│   │   ├── GradeSubmission.tsx
│   │   └── components/
│   │       ├── ExamForm.tsx
│   │       ├── ScheduleGrid.tsx
│   │       └── GradeTracker.tsx
│   │
│   ├── admin-rooms/
│   │   ├── RoomManagement.tsx
│   │   └── components/
│   │       ├── RoomList.tsx
│   │       ├── BookingHandler.tsx
│   │       └── AvailabilityCalendar.tsx
│   │
│   ├── admin-complaints/
│   │   ├── ComplaintManagement.tsx
│   │   └── components/
│   │       ├── ComplaintList.tsx
│   │       ├── ComplaintDetail.tsx
│   │       └── AssignmentHandler.tsx
│   │
│   ├── admin-announcements/
│   │   ├── AnnouncementManagement.tsx
│   │   └── components/
│   │       ├── AnnouncementForm.tsx
│   │       ├── AnnouncementList.tsx
│   │       └── RichTextEditor.tsx
│   │
│   ├── admin-reports/
│   │   ├── ReportGeneration.tsx
│   │   └── components/
│   │       ├── ReportSelector.tsx
│   │       ├── ReportBuilder.tsx
│   │       └── ChartViewer.tsx
│   │
│   ├── admin-settings/
│   │   ├── SystemSettings.tsx
│   │   ├── AdminActivityLogs.tsx
│   │   └── components/
│   │       ├── SettingsForm.tsx
│   │       └── LogViewer.tsx
│   │
│   └── admin-profile/ (Reuse student/teacher structure)
│       └── AdminProfile.tsx
│
├── components/
│   ├── AdminDashboardLayout.tsx (Similar to TeacherDashboardLayout)
│   └── ProtectedAdminRoute.tsx
│
├── services/
│   ├── adminService.ts (API calls)
│   ├── courseService.ts
│   ├── registrationService.ts
│   ├── examService.ts
│   └── complaintService.ts
│
└── styles/
    └── admin.css (Additional admin-specific styles)
```

### 5.2 Component Patterns

#### **Base Layout Component**
```tsx
// AdminDashboardLayout.tsx
- Sidebar navigation (admin-specific)
- Top header with admin name
- Bottom profile/settings/logout (like teacher/student)
- Main content area
- Consistent styling
```

#### **Reusable Components**
```tsx
// Card Component
<AdminCard 
  title="Courses"
  icon={<BookIcon />}
  content={/* any content */}
/>

// List Table Component
<DataTable
  columns={[...]}
  data={[...]}
  onEdit={handle}
  onDelete={handle}
  searchable
  sortable
  filterable
/>

// Form Component
<AdminForm
  fields={[...]}
  onSubmit={handle}
  loading={false}
/>

// Modal Component
<AdminModal
  title="Add Course"
  open={true}
  onClose={handle}
  children={/* form */}
/>
```

---

## SECTION 6: API ENDPOINTS (Backend Reference)

### 6.1 Admin Authentication
```
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/me (current admin info)
POST   /api/admin/change-password
```

### 6.2 User Management APIs
```
GET    /api/admin/teachers (list)
POST   /api/admin/teachers (create)
GET    /api/admin/teachers/:id (detail)
PUT    /api/admin/teachers/:id (update)
DELETE /api/admin/teachers/:id (soft delete)
POST   /api/admin/teachers/bulk-upload (CSV)

GET    /api/admin/students (list)
POST   /api/admin/students (create)
GET    /api/admin/students/:id (detail)
PUT    /api/admin/students/:id (update)
POST   /api/admin/students/bulk-upload (CSV)
POST   /api/admin/students/:id/graduate (mark as graduated)
```

### 6.3 Course APIs
```
GET    /api/admin/courses (list)
POST   /api/admin/courses (create)
PUT    /api/admin/courses/:id (update)
GET    /api/admin/courses/:id/sections (get all sections)
POST   /api/admin/courses/:id/offer (mark for offering)

GET    /api/admin/course-sections (list)
POST   /api/admin/course-sections (create)
PUT    /api/admin/course-sections/:id (update)
PUT    /api/admin/course-sections/:id/assign-teacher
GET    /api/admin/course-sections/:id/enrolled-students
```

### 6.4 Schedule/Routine APIs
```
GET    /api/admin/routine (weekly view)
POST   /api/admin/routine (add class)
PUT    /api/admin/routine/:id (update)
DELETE /api/admin/routine/:id (remove)
POST   /api/admin/routine/bulk-upload (CSV)
POST   /api/admin/routine/check-conflicts (validate)
```

### 6.5 Academic Calendar APIs
```
GET    /api/admin/academic-calendar (current)
POST   /api/admin/academic-calendar (create)
PUT    /api/admin/academic-calendar/:id (update)
GET    /api/admin/academic-calendar/list (all)
POST   /api/admin/academic-calendar/:id/activate
```

### 6.6 Registration APIs
```
GET    /api/admin/registration-settings (current)
PUT    /api/admin/registration-settings (update)
GET    /api/admin/registrations (list)
GET    /api/admin/registrations/:studentId (student's regs)
POST   /api/admin/registrations/:id/approve
POST   /api/admin/registrations/:id/drop (handle drop)
```

### 6.7 Exam APIs
```
GET    /api/admin/exam-schedule (list)
POST   /api/admin/exam-schedule (create)
PUT    /api/admin/exam-schedule/:id (update)
POST   /api/admin/exam-schedule/generate-bulk
GET    /api/admin/exam-schedule/check-conflicts
POST   /api/admin/exam-schedule/:id/publish

GET    /api/admin/grade-submission (status)
GET    /api/admin/grade-submission/:teacherId
POST   /api/admin/grade-submission/:id/approve
```

### 6.8 Complaint APIs
```
GET    /api/admin/complaints (list)
GET    /api/admin/complaints/:id (detail)
PUT    /api/admin/complaints/:id (update status/priority)
POST   /api/admin/complaints/:id/assign
POST   /api/admin/complaints/:id/comments (add comment)
POST   /api/admin/complaints/:id/resolve
```

### 6.9 Announcement APIs
```
GET    /api/admin/announcements (list)
POST   /api/admin/announcements (create)
PUT    /api/admin/announcements/:id (update)
DELETE /api/admin/announcements/:id
POST   /api/admin/announcements/:id/publish
```

### 6.10 Room APIs
```
GET    /api/admin/rooms (list)
POST   /api/admin/rooms (create)
PUT    /api/admin/rooms/:id (update)
GET    /api/admin/rooms/:id/bookings (availability)

GET    /api/admin/room-bookings (list)
POST   /api/admin/room-bookings/:id/approve
POST   /api/admin/room-bookings/:id/reject
```

### 6.11 Reports APIs
```
GET    /api/admin/reports/enrollment (filters)
GET    /api/admin/reports/attendance (filters)
GET    /api/admin/reports/performance (filters)
GET    /api/admin/reports/complaints (filters)
GET    /api/admin/reports/export (PDF/Excel)
```

### 6.12 Activity Logs APIs
```
GET    /api/admin/logs (list)
GET    /api/admin/logs/search (search)
GET    /api/admin/logs/export (CSV)
```

---

## SECTION 7: SECURITY CONSIDERATIONS

### 7.1 Access Control
- **Super Admin**: All permissions
- **Department Admin**: CSE-specific only (can't see other departments)
- **Support Staff**: Limited (complaints, announcements only)
- **Role-based routes**: Redirect if unauthorized

### 7.2 Data Protection
- All APIs require authentication
- Sensitive data (passwords) never exposed
- Audit logs for all admin actions
- Session timeout after inactivity

### 7.3 Input Validation
- Server-side validation on all inputs
- Sanitize file uploads (CSV validation)
- Check data integrity before saving

### 7.4 Rate Limiting
- Limit bulk uploads (prevent abuse)
- API rate limiting to prevent DoS

---

## SECTION 8: IMPLEMENTATION ROADMAP

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create AdminDashboardLayout component
- [ ] Setup admin routes in App.tsx
- [ ] Create admin-specific services
- [ ] Build admin authentication
- [ ] Create reusable components (cards, tables, forms)

### Phase 2: Dashboard & Basic Management (Week 2)
- [ ] Build admin dashboard
- [ ] Implement teacher management (CRUD)
- [ ] Implement student management (bulk upload)
- [ ] Create admin profile page

### Phase 3: Academic Structure (Week 3)
- [ ] Implement course management
- [ ] Implement section/class management
- [ ] Create routine scheduling
- [ ] Add routine conflict detection

### Phase 4: Registration System (Week 4)
- [ ] Build registration settings
- [ ] Implement registration oversight
- [ ] Create drop/add management
- [ ] Build registration reports

### Phase 5: Exam & Calendar (Week 5)
- [ ] Implement academic calendar
- [ ] Build exam scheduling
- [ ] Create grade submission tracker
- [ ] Build exam reports

### Phase 6: Support Features (Week 6)
- [ ] Implement complaint management
- [ ] Build announcement system
- [ ] Create room/resource booking handler
- [ ] Build activity logs

### Phase 7: Reports & Polish (Week 7)
- [ ] Build comprehensive reports
- [ ] Create data export features
- [ ] Analytics dashboard
- [ ] Performance optimization
- [ ] Testing & bug fixes

### Phase 8: Deployment (Week 8)
- [ ] Final testing
- [ ] Deployment to production
- [ ] Training documentation
- [ ] User manual creation

---

## SECTION 9: DATA VALIDATION RULES

### 9.1 Course Management
- Course code: Unique, format CSExxxx
- Credits: 1-4 only
- Semester: 1-8 only
- Cannot delete if sections exist

### 9.2 Section Management
- Max 3 sections per course (A, B, C)
- Min 1, Max 50 students per section
- Must have teacher assigned before students register
- Cannot delete if students enrolled

### 9.3 Routine Scheduling
- No room double-booking
- No teacher double-booking (same time)
- No student schedule conflicts
- Minimum 15 minutes gap between classes

### 9.4 Registration
- Student cannot register if:
  - Academic year not set
  - Registration window closed
  - Missing prerequisites
  - Already registered for same course
  - Exceeds max credits

### 9.5 Exam Scheduling
- No student exam conflicts
- Room must have sufficient capacity
- Exam duration: 2 hours standard
- Cannot schedule during classes

---

## SECTION 10: FEATURES PRIORITY (MVP vs Future)

### MVP (Must Have)
1. ✅ Dashboard with basic stats
2. ✅ Teacher management
3. ✅ Student management (bulk upload)
4. ✅ Course management
5. ✅ Class/section assignment
6. ✅ Routine scheduling
7. ✅ Academic calendar
8. ✅ Registration settings
9. ✅ Complaint management (basic)
10. ✅ Announcements

### Phase 2 (Nice to Have)
1. Exam scheduling
2. Grade submission tracking
3. Room booking management
4. Comprehensive reports
5. Analytics dashboard
6. Activity logs

### Phase 3 (Future)
1. Multi-department support
2. Financial management (skip for now)
3. Advanced analytics
4. Integration with external systems
5. Mobile app support

---

## SECTION 11: TESTING STRATEGY

### 11.1 Unit Testing
- Test form validations
- Test data transformations
- Test utility functions

### 11.2 Integration Testing
- Test API calls
- Test data flow end-to-end
- Test role-based access

### 11.3 E2E Testing
- Test complete workflows
- Test conflict detection
- Test bulk operations

### 11.4 Performance Testing
- Load testing with large datasets
- API response time verification
- Database query optimization

---

## SECTION 12: ERROR HANDLING

### 12.1 API Errors
- 401: Unauthorized (not logged in)
- 403: Forbidden (don't have permission)
- 404: Not found (resource deleted)
- 400: Bad request (validation error)
- 500: Server error

### 12.2 UI Error Handling
- Show user-friendly error messages
- Provide actionable solutions
- Log errors for debugging
- Retry mechanisms for failed requests

---

## SECTION 13: PERFORMANCE OPTIMIZATION

### 13.1 Frontend
- Code splitting by route
- Lazy loading of components
- Image optimization
- Caching strategies

### 13.2 Backend
- Database indexing
- Query optimization
- Pagination for large lists
- API response caching

### 13.3 Database
- Proper indexing on search fields
- Denormalization where needed
- Archive old data (complaints, logs)

---

## SECTION 14: DOCUMENTATION REQUIREMENTS

### 14.1 User Documentation
- Admin manual (PDF)
- Video tutorials
- FAQ section
- Troubleshooting guide

### 14.2 Developer Documentation
- API documentation
- Component documentation
- Deployment guide
- Database schema docs

---

## SECTION 15: DEPLOYMENT CHECKLIST

Before going live:
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Backup procedures tested
- [ ] Disaster recovery plan ready
- [ ] Documentation complete
- [ ] User training completed
- [ ] Admin training completed
- [ ] Support team ready

---

## NOTES & IMPORTANT REMINDERS

1. **Color Consistency**: Always use the primary colors defined in Section 2.1
2. **Component Reuse**: Create generic components, don't duplicate code
3. **Naming Convention**: 
   - Components: PascalCase (AdminDashboard.tsx)
   - Utilities: camelCase (formatDate.ts)
   - API services: Verb+Noun (getUserData)
4. **Error States**: Every list/table needs empty state, error state
5. **Loading States**: Show loading spinners for async operations
6. **Responsiveness**: Admin panels are desktop-first, but should handle tablets
7. **Accessibility**: ARIA labels, keyboard navigation, contrast ratios
8. **Internationalization**: (Future) Plan for multi-language support

---

**Document Version:** 1.0
**Last Updated:** February 3, 2026
**Next Review:** After Phase 1 Completion
