# Admin Panel Implementation - Detailed Phase-wise Breakdown

**Project Start Date:** February 3, 2026
**Total Duration:** 4-5 Weeks
**Scope:** BSc CSE Program Administration System

---

# PHASE 1: Base Infrastructure & Layout Setup
**Duration:** 2-3 Days
**Status:** ⏳ Not Started

## 📋 Phase Objectives
- Setup admin panel foundation
- Create reusable components
- Establish navigation structure
- Configure admin routes

## ✅ Deliverables

### 1.1 AdminDashboardLayout Component
**File:** `d:\edVerse\client\src\components\AdminDashboardLayout.tsx`

**Must Include:**
- [ ] Sidebar navigation (fixed left)
  - Logo/Admin brand
  - Main menu links (12-15 items)
  - Collapsible menu (optional)
- [ ] Top header bar
  - Page title and breadcrumb
  - Search bar
  - Notification icon
  - Admin name/avatar
- [ ] Bottom panel (3 buttons)
  - Profile icon → `/admin/profile`
  - Settings icon → `/admin/settings`
  - Logout icon
- [ ] Main content area wrapper
- [ ] Consistent styling with theme (#0C2B4E, #1A3D64)
- [ ] Mobile responsive (sidebar collapse)

**Color Scheme:**
```
Primary: #0C2B4E (Dark Blue)
Secondary: #1A3D64 (Medium Blue)
Accent: #1D546C (Teal)
Gray: #F3F4F6 (Light), #6B7280 (Dark)
```

### 1.2 Reusable Admin Components
**Location:** `d:\edVerse\client\src\components\`

**Components to Create:**

**a) StatCard.tsx**
```tsx
Props:
- title: string
- value: string | number
- icon: React.ReactNode
- color?: 'blue' | 'green' | 'red' | 'yellow'
- trend?: { value: number, isPositive: boolean }
```

**b) DataTable.tsx**
```tsx
Props:
- columns: ColumnDef[]
- data: any[]
- searchable?: boolean
- sortable?: boolean
- filterable?: boolean
- actions?: { label, onClick }[]
- loading?: boolean
- empty?: React.ReactNode
```

**c) AdminForm.tsx**
```tsx
Props:
- fields: FormField[]
- onSubmit: (data) => void
- loading?: boolean
- submitText?: string
```

**d) AdminModal.tsx**
```tsx
Props:
- title: string
- open: boolean
- onClose: () => void
- size?: 'sm' | 'md' | 'lg'
- children: React.ReactNode
```

**e) LoadingSpinner.tsx**
```tsx
Props:
- size?: 'sm' | 'md' | 'lg'
- text?: string
```

**f) EmptyState.tsx**
```tsx
Props:
- icon: React.ReactNode
- title: string
- description: string
- action?: { label, onClick }
```

**g) PageHeader.tsx**
```tsx
Props:
- title: string
- subtitle?: string
- icon: React.ReactNode
- action?: { label, onClick }
```

### 1.3 Admin Routes Setup
**File:** `d:\edVerse\client\src\App.tsx`

**Routes to Add:**
```
/admin                     → AdminDashboard (redirect to /admin/dashboard)
/admin/dashboard           → Admin Dashboard
/admin/profile             → AdminProfile
/admin/settings            → AdminSettings
/admin/teachers            → TeacherManagement
/admin/students            → StudentManagement
/admin/courses             → CourseManagement
/admin/course-sections     → SectionManagement
/admin/routine             → RoutineManagement
/admin/registrations       → RegistrationOversight
/admin/registration-settings → RegistrationPortal
/admin/academic-calendar   → AcademicCalendar
/admin/exams              → ExamSchedule
/admin/grade-submission   → GradeSubmissionTracker
/admin/complaints         → ComplaintManagement
/admin/announcements      → AnnouncementManagement
/admin/rooms              → RoomManagement
/admin/reports            → ReportGeneration
/admin/logs               → ActivityLogs
```

**Protection:** All routes must be protected with `ProtectedAdminRoute`

### 1.4 Authentication Setup
**File:** `d:\edVerse\client\src\components\ProtectedAdminRoute.tsx`

**Must Include:**
- [ ] Check if user is logged in
- [ ] Check if user role is 'admin'
- [ ] Check admin access level (super or department)
- [ ] Redirect to login if not authorized
- [ ] Redirect to admin dashboard if already logged in (prevent re-login)

### 1.5 Admin Services/APIs
**File:** `d:\edVerse\client\src\services\adminService.ts`

**Must Include:**
- [ ] Base API URL setup
- [ ] Error handling
- [ ] Token management
- [ ] Response formatting
- [ ] Timeout handling

**Basic Structure:**
```typescript
class AdminService {
  private apiUrl = '/api/admin'
  
  // Auth
  async login(email, password)
  async logout()
  
  // Data fetching placeholders
  async getDashboardStats()
  async getTeachers()
  async getCourses()
  async getRegistrations()
  // ... etc
}
```

### 1.6 Admin Profile Page
**File:** `d:\edVerse\client\src\features\admin-profile\AdminProfile.tsx`

**Must Include:**
- [ ] Admin profile info (Name, Email, ID, Department, Access Level)
- [ ] Profile photo upload
- [ ] Edit info button
- [ ] Password change option
- [ ] Last login info
- [ ] Activity summary

### 1.7 Admin Settings Page
**File:** `d:\edVerse\client\src\features\admin-settings\AdminSettings.tsx`

**Must Include:**
- [ ] General Settings (University name, CSE dept info)
- [ ] Email preferences
- [ ] Notification settings
- [ ] Export/Import options
- [ ] System info (Last backup, Database size)

### 1.8 Folder Structure Creation
**Create all folders:**
```
client/src/features/
├── admin-dashboard/
├── admin-teachers/
├── admin-students/
├── admin-courses/
├── admin-sections/
├── admin-routine/
├── admin-registrations/
├── admin-calendar/
├── admin-exams/
├── admin-complaints/
├── admin-announcements/
├── admin-rooms/
├── admin-reports/
├── admin-profile/
├── admin-settings/
└── admin-logs/
```

---

## 🎯 Phase 1 Acceptance Criteria

**Must Pass ALL:**
- [ ] AdminDashboardLayout loads without errors
- [ ] Sidebar navigation links work correctly
- [ ] All 15+ routes are accessible
- [ ] Bottom panel (Profile/Settings/Logout) functions properly
- [ ] Color scheme is consistent (#0C2B4E theme)
- [ ] Reusable components render correctly
- [ ] ProtectedAdminRoute prevents unauthorized access
- [ ] Layout is responsive (desktop first, tablet support)
- [ ] No console errors or warnings
- [ ] Theme consistency matches student/teacher panels

**To Verify:**
1. [ ] Run `npm start` successfully
2. [ ] Navigate to `/admin/dashboard` and see layout
3. [ ] Click sidebar links - all route to correct pages (empty pages OK)
4. [ ] Click profile/settings/logout in bottom panel
5. [ ] Test responsive design (F12 → toggle device toolbar)
6. [ ] Check color consistency
7. [ ] Verify no unauthorized access (try accessing without login)

---

## 📁 Files to Create/Modify

### Create (New Files):
```
✓ d:\edVerse\client\src\components\AdminDashboardLayout.tsx
✓ d:\edVerse\client\src\components\StatCard.tsx
✓ d:\edVerse\client\src\components\DataTable.tsx
✓ d:\edVerse\client\src\components\AdminForm.tsx
✓ d:\edVerse\client\src\components\AdminModal.tsx
✓ d:\edVerse\client\src\components\LoadingSpinner.tsx
✓ d:\edVerse\client\src\components\EmptyState.tsx
✓ d:\edVerse\client\src\components\PageHeader.tsx
✓ d:\edVerse\client\src\components\ProtectedAdminRoute.tsx
✓ d:\edVerse\client\src\services\adminService.ts
✓ d:\edVerse\client\src\features\admin-profile\AdminProfile.tsx
✓ d:\edVerse\client\src\features\admin-settings\AdminSettings.tsx
✓ All folder structure as listed above
```

### Modify (Existing Files):
```
✓ d:\edVerse\client\src\App.tsx (Add admin routes)
✓ d:\edVerse\client\src\services\authService.ts (Add admin role check)
```

---

## 💾 Phase Completion Checklist

Mark each item as completed:

- [ ] AdminDashboardLayout.tsx created and styled
- [ ] Sidebar navigation implemented (12-15 menu items)
- [ ] Top header with page title, search, notifications
- [ ] Bottom panel with 3 icon buttons
- [ ] All 7 reusable components created
- [ ] ProtectedAdminRoute component created
- [ ] Admin routes added to App.tsx
- [ ] adminService.ts setup
- [ ] AdminProfile page created
- [ ] AdminSettings page created
- [ ] All folders created
- [ ] No console errors
- [ ] Color scheme verified
- [ ] Responsive design tested
- [ ] Navigation between pages works
- [ ] Profile/Settings/Logout buttons functional

---

## 🚀 How to Start Phase 1

1. **Create the AdminDashboardLayout.tsx first** (This is foundation)
2. **Then create all 7 reusable components**
3. **Add routes in App.tsx**
4. **Create profile/settings pages**
5. **Test and verify**

---

---

# PHASE 2: Dashboard Development
**Duration:** 2 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Create admin dashboard landing page
- Display quick stats
- Show activity feed
- Display pending actions
- Add basic charts

## ✅ Deliverables

### 2.1 Admin Dashboard Main Page
**File:** `d:\edVerse\client\src\features\admin-dashboard\AdminDashboard.tsx`

**Components:**
- [ ] Welcome section (Admin name, current semester)
- [ ] 5 StatCards:
  - Total Students (This Batch)
  - Total Teachers (CSE)
  - Active Courses (This Semester)
  - Pending Approvals (Room bookings + Complaints)
  - Upcoming Events (Next 7 days)
- [ ] Charts (using Chart.js or Recharts):
  - Enrollment by section (Bar chart)
  - Attendance overview (Line chart)
  - Complaint resolution rate (Pie chart)
- [ ] Recent Activities feed (5 latest)
  - New registrations
  - New complaints
  - Grade submissions
- [ ] Pending Actions box:
  - Room booking approvals pending
  - Complaints not assigned
  - Grades not submitted

### 2.2 Mock Data Setup
**File:** `d:\edVerse\client\src\services\mockData.ts`

**Must Include:**
- [ ] Mock stats data
- [ ] Mock chart data
- [ ] Mock activity feed
- [ ] Mock pending actions

## 🎯 Acceptance Criteria

- [ ] Dashboard page loads and displays all sections
- [ ] StatCards show correct data
- [ ] Charts render properly
- [ ] Activity feed shows 5 recent items
- [ ] Pending actions box is visible
- [ ] All data is properly formatted
- [ ] Styling matches admin theme
- [ ] No console errors

---

---

# PHASE 3: Teacher Management
**Duration:** 3 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Build teacher list and CRUD operations
- Create teacher detail view
- Implement add/edit teacher functionality

## ✅ Deliverables

### 3.1 Teacher List Page
**File:** `d:\edVerse\client\src\features\admin-teachers\TeacherList.tsx`

**Must Include:**
- [ ] DataTable with columns:
  - Name
  - Teacher ID
  - Department
  - Designation
  - Courses Assigned (Count)
  - Status (Active/Inactive)
- [ ] Search by name/ID
- [ ] Filter by status, designation
- [ ] Sort by name, courses, status
- [ ] Buttons: View, Edit, Disable/Enable
- [ ] Pagination (if >10 teachers)

### 3.2 Teacher Detail View
**File:** `d:\edVerse\client\src\features\admin-teachers\TeacherDetail.tsx`

**Must Include:**
- [ ] Full profile information
- [ ] Courses assigned (current semester)
- [ ] Weekly routine/schedule
- [ ] Edit button
- [ ] Disable/Reactivate button
- [ ] Password reset button
- [ ] Back to list button

### 3.3 Add/Edit Teacher Form
**File:** `d:\edVerse\client\src\features\admin-teachers\TeacherForm.tsx`

**Form Fields:**
- [ ] Full Name (text input)
- [ ] Email (email input, unique check)
- [ ] Phone (text input)
- [ ] Teacher ID (auto-generated, read-only)
- [ ] Designation (dropdown: Assistant Professor, Associate Professor, Professor)
- [ ] Specialization (text input)
- [ ] Status (Active/Inactive)
- [ ] Submit button (Add/Update)
- [ ] Cancel button

**Validations:**
- [ ] Name required
- [ ] Email required and unique
- [ ] Phone required
- [ ] Email format validation

### 3.4 Bulk Upload CSV
**File:** `d:\edVerse\client\src\features\admin-teachers\BulkUpload.tsx`

**Features:**
- [ ] File input (CSV only)
- [ ] CSV template download
- [ ] Preview data before upload
- [ ] Validation (duplicate check, email format)
- [ ] Upload button
- [ ] Success/Error messages

**CSV Format:**
```
Name, Email, Phone, Designation, Specialization
Dr. Ahmed Khan, ahmed@edu.edu, +880123456, Assistant Professor, Database Systems
```

## 🎯 Acceptance Criteria

- [ ] Teacher list displays correctly
- [ ] Search/filter/sort works
- [ ] Can add new teacher
- [ ] Can edit existing teacher
- [ ] Can delete/disable teacher
- [ ] Can view teacher details
- [ ] Bulk upload works
- [ ] All validations pass
- [ ] No console errors
- [ ] Theme consistency maintained

---

---

# PHASE 4: Student Management
**Duration:** 3 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Build student list view
- Implement bulk upload (CSV)
- Student detail view
- Student status management

## ✅ Deliverables

### 4.1 Student List Page
**File:** `d:\edVerse\client\src\features\admin-students\StudentList.tsx`

**Must Include:**
- [ ] DataTable with columns:
  - Name
  - Student ID
  - Batch
  - Section (A/B/C)
  - Registered Courses (Count)
  - Attendance (%)
  - Status (Active/Graduated/Suspended)
- [ ] Filter by batch, section, status
- [ ] Search by name/ID
- [ ] Sort options
- [ ] Buttons: View, Edit, Graduate, Suspend
- [ ] Pagination

### 4.2 Student Detail View
**File:** `d:\edVerse\client\src\features\admin-students\StudentDetail.tsx`

**Must Include:**
- [ ] Personal information
- [ ] Registered courses (with grades if available)
- [ ] Attendance across courses
- [ ] Overall CGPA
- [ ] Academic standing (Good/Warning/Probation)
- [ ] Action buttons (Edit, Graduate, Suspend)

### 4.3 Bulk Upload CSV (Primary)
**File:** `d:\edVerse\client\src\features\admin-students\BulkUploadStudents.tsx`

**Features:**
- [ ] Drag-drop file upload
- [ ] CSV template with headers
- [ ] Preview uploaded data
- [ ] Validation:
  - Duplicate student ID check
  - Email format check
  - Batch number validation
  - Section validation (A/B/C)
- [ ] Upload confirmation
- [ ] Success/Error report

**CSV Format:**
```
Name, Email, Phone, Batch, Section, StudentID
Karim Ahmed, karim@edu.edu, +880123456, 2024, A, STD-2024-001
```

### 4.4 Student Status Management
**File:** `d:\edVerse\client\src\features\admin-students\StudentStatusModal.tsx`

**Modal for:**
- [ ] Graduate Student (mark as graduated)
- [ ] Suspend Student (deactivate account)
- [ ] Reactivate Student
- [ ] Confirmation dialogs

## 🎯 Acceptance Criteria

- [ ] Student list displays
- [ ] Search/filter works
- [ ] Bulk upload works (CSV parsing)
- [ ] Can view student details
- [ ] Can graduate student
- [ ] Can suspend/reactivate
- [ ] Validations work
- [ ] No console errors
- [ ] Theme consistent

---

---

# PHASE 5: Course Management
**Duration:** 2 Days
**Status:** ⏳ Waiting for Phases 1-4

## 📋 Phase Objectives
- Setup course management
- Create course list
- Add/Edit courses
- Mark offering for semester

## ✅ Deliverables

### 5.1 Course List Page
**File:** `d:\edVerse\client\src\features\admin-courses\CourseList.tsx`

**Must Include:**
- [ ] DataTable with columns:
  - Course Code (CSE101)
  - Course Name
  - Credit Hours
  - Semester (1-8)
  - Offering Status (Yes/No)
- [ ] Filter by semester
- [ ] Search by code/name
- [ ] Buttons: View, Edit, Archive
- [ ] Pagination

### 5.2 Add/Edit Course Form
**File:** `d:\edVerse\client\src\features\admin-courses\CourseForm.tsx`

**Form Fields:**
- [ ] Course Code (CSE + 3 digits, unique)
- [ ] Course Name (text)
- [ ] Credit Hours (1-4)
- [ ] Semester (1-8 dropdown)
- [ ] Prerequisites (multi-select other courses)
- [ ] Description (textarea)
- [ ] Offering Status (Yes/No)
- [ ] Submit button

**Validations:**
- [ ] Code format (CSEXXX)
- [ ] Code must be unique
- [ ] Credits 1-4
- [ ] Semester 1-8
- [ ] Name required

### 5.3 Course Offering Setup
**File:** `d:\edVerse\client\src\features\admin-courses\CourseOffering.tsx`

**Features:**
- [ ] Select academic year
- [ ] Select semester
- [ ] Multi-select courses to offer
- [ ] Set max students per section
- [ ] Auto-calculate sections (A, B, C based on capacity)
- [ ] Preview sections to be created
- [ ] Submit button

## 🎯 Acceptance Criteria

- [ ] Course list displays
- [ ] Can create new course
- [ ] Can edit course
- [ ] Can archive course
- [ ] Cannot delete if sections exist
- [ ] Course offering works
- [ ] All validations pass
- [ ] No console errors

---

---

# PHASE 6: Course Sections & Teacher Assignment
**Duration:** 2-3 Days
**Status:** ⏳ Waiting for Phases 1-5

## 📋 Phase Objectives
- Create course sections
- Assign teachers to sections
- View section enrollments
- Manage section capacity

## ✅ Deliverables

### 6.1 Section Management Page
**File:** `d:\edVerse\client\src\features\admin-sections\SectionManagement.tsx`

**Must Include:**
- [ ] DataTable with columns:
  - Course Code
  - Course Name
  - Section (A/B/C)
  - Assigned Teacher
  - Enrolled Students (Count)
  - Capacity
  - Status
- [ ] Filter by course, section
- [ ] Search
- [ ] Buttons: Assign Teacher, View Students, Edit Capacity

### 6.2 Teacher Assignment Interface
**File:** `d:\edVerse\client\src\features\admin-sections\TeacherAssignment.tsx`

**Features:**
- [ ] Dropdown to select teacher
- [ ] Show teacher workload (current courses)
- [ ] Prevent overload (max 4 courses per teacher)
- [ ] Unassign button
- [ ] Confirmation dialog
- [ ] Show assignment history

### 6.3 Enrolled Students View
**File:** `d:\edVerse\client\src\features\admin-sections\EnrolledStudents.tsx`

**Must Show:**
- [ ] List of enrolled students
- [ ] Student ID, Name, Email
- [ ] Registration date
- [ ] Grade (if semester ended)
- [ ] Remove student button (if allowed)

### 6.4 Capacity Management
**File:** `d:\edVerse\client\src\features\admin-sections\CapacityManager.tsx`

**Features:**
- [ ] Current capacity display
- [ ] Edit capacity modal
- [ ] Warning if new capacity < enrolled students
- [ ] Save changes

## 🎯 Acceptance Criteria

- [ ] Section list displays
- [ ] Can assign teacher to section
- [ ] Teacher workload validation works
- [ ] Can view enrolled students
- [ ] Can change capacity
- [ ] All validations pass
- [ ] No console errors

---

---

# PHASE 7: Routine/Schedule Management
**Duration:** 3 Days
**Status:** ⏳ Waiting for Phases 1-6

## 📋 Phase Objectives
- Create weekly schedule grid
- Add/Edit classes to schedule
- Detect conflicts
- Bulk upload schedule

## ✅ Deliverables

### 7.1 Schedule Grid View
**File:** `d:\edVerse\client\src\features\admin-routine\RoutineGrid.tsx`

**Features:**
- [ ] Weekly calendar (Mon-Fri)
- [ ] Time slots (08:00-17:00)
- [ ] Rooms as columns
- [ ] Color-coded by course section
- [ ] Click to view details
- [ ] Hover to see full info
- [ ] Add class button
- [ ] Print/Export button

### 7.2 Add/Edit Schedule Form
**File:** `d:\edVerse\client\src\features\admin-routine\ScheduleForm.tsx`

**Form Fields:**
- [ ] Course Section (dropdown)
- [ ] Day (Mon-Fri)
- [ ] Start Time (time picker)
- [ ] End Time (time picker)
- [ ] Room (dropdown)
- [ ] Building (auto-filled)
- [ ] Submit button

**Validations:**
- [ ] Check room conflicts
- [ ] Check teacher conflicts
- [ ] Minimum 15 mins gap
- [ ] Duration max 3 hours

### 7.3 Conflict Detector
**File:** `d:\edVerse\client\src\features\admin-routine\ConflictDetector.tsx`

**Checks:**
- [ ] Room double-booking
- [ ] Teacher double-booking
- [ ] Student schedule conflicts (same student in 2 classes)
- [ ] Display warnings before saving
- [ ] Suggest alternatives

### 7.4 Bulk Upload Schedule
**File:** `d:\edVerse\client\src\features\admin-routine\BulkScheduleUpload.tsx`

**Features:**
- [ ] CSV file upload
- [ ] Preview data
- [ ] Validate before upload
- [ ] Run conflict check
- [ ] Upload with confirmation
- [ ] Report results

**CSV Format:**
```
CourseCode, Section, Day, StartTime, EndTime, Room, Building
CSE101, A, Monday, 09:00, 10:30, 204, Building A
```

### 7.5 Schedule Reports
**File:** `d:\edVerse\client\src\features\admin-routine\ScheduleReports.tsx`

**Reports:**
- [ ] Per course section routine
- [ ] Per teacher routine
- [ ] Per room utilization
- [ ] Export to PDF/Excel

## 🎯 Acceptance Criteria

- [ ] Schedule grid displays
- [ ] Can add class to schedule
- [ ] Can edit/delete class
- [ ] Conflicts detected correctly
- [ ] Bulk upload works
- [ ] Reports export correctly
- [ ] No console errors

---

---

# PHASE 8: Academic Calendar Setup
**Duration:** 1-2 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Setup academic calendar
- Define semester dates
- Setup important deadlines
- Manage holidays

## ✅ Deliverables

### 8.1 Academic Calendar Form
**File:** `d:\edVerse\client\src\features\admin-calendar\AcademicCalendarForm.tsx`

**Form Sections:**

**A) Basic Info:**
- [ ] Academic Year (2026, 2027...)
- [ ] Semester (Spring/Fall dropdown)
- [ ] Status (Active/Inactive toggle)

**B) Key Dates:**
- [ ] Semester Start Date
- [ ] Semester End Date
- [ ] Class Start Date
- [ ] Class End Date
- [ ] Registration Start Date
- [ ] Registration End Date
- [ ] Late Registration Start
- [ ] Late Registration End
- [ ] Drop/Add Start Date
- [ ] Drop/Add End Date
- [ ] Midterm Start Date
- [ ] Midterm End Date
- [ ] Final Start Date
- [ ] Final End Date
- [ ] Grade Submission Deadline

**C) Holidays:**
- [ ] Add holiday button
- [ ] Date + Reason input
- [ ] Remove holiday option

**D) Submit:**
- [ ] Save button
- [ ] Cancel button
- [ ] Clone from previous semester (optional)

### 8.2 Calendar Visualization
**File:** `d:\edVerse\client\src\features\admin-calendar\CalendarView.tsx`

**Features:**
- [ ] Month view
- [ ] Color-coded events:
  - Registration period (Blue)
  - Exam period (Red)
  - Holidays (Yellow)
  - Classes (Green)
- [ ] Click event to edit
- [ ] Legend showing colors
- [ ] Print option

### 8.3 Calendar List View
**File:** `d:\edVerse\client\src\features\admin-calendar\CalendarList.tsx`

**Must Show:**
- [ ] All calendar entries
- [ ] Filter by semester
- [ ] Mark active calendar
- [ ] Edit button
- [ ] Delete button (if not active)

## 🎯 Acceptance Criteria

- [ ] Can create academic calendar
- [ ] All dates saved correctly
- [ ] Can add/remove holidays
- [ ] Can clone previous semester
- [ ] Calendar visualization works
- [ ] Can mark as active
- [ ] No console errors

---

---

# PHASE 9: Registration Portal Control
**Duration:** 2-3 Days
**Status:** ⏳ Waiting for Phases 1-8

## 📋 Phase Objectives
- Setup registration portal settings
- Create registration oversight view
- Handle drop/add requests
- Export registration data

## ✅ Deliverables

### 9.1 Registration Settings Page
**File:** `d:\edVerse\client\src\features\admin-registrations\RegistrationSettings.tsx`

**Settings Form:**
- [ ] Current Semester (display, read-only)
- [ ] Registration Status (Not Started / Active / Closed - dropdown)
- [ ] Registration Start Date & Time
- [ ] Registration End Date & Time
- [ ] Late Registration Period (Yes/No checkbox)
  - If yes: Late Start Date & Late End Date
- [ ] Min Credits Per Semester
- [ ] Max Credits Per Semester
- [ ] Enforce Prerequisites (Yes/No)
- [ ] Enforce Co-requisites (Yes/No)
- [ ] Max Students Per Section
- [ ] Preview text showing current status
- [ ] Save button
- [ ] Test/Preview mode toggle

**Status Display:**
- [ ] Big badge showing current status
- [ ] Countdown timer if active
- [ ] "Opens in X days" if not started
- [ ] "Closed" if finished

### 9.2 Registration Oversight Page
**File:** `d:\edVerse\client\src\features\admin-registrations\RegistrationOversight.tsx`

**Must Include:**
- [ ] Stats cards:
  - Total Students
  - Completed Registrations (%)
  - Pending Registrations (Count)
  - Dropped Courses (Count)

- [ ] Registrations table:
  - Student Name & ID
  - Section (A/B/C)
  - Courses Registered (Count)
  - Total Credits
  - Status (Registered/Pending/Dropped)
  - Registration Date

- [ ] Filters:
  - Filter by batch
  - Filter by section
  - Filter by status

- [ ] Search by student name/ID

- [ ] Actions:
  - View student registration details
  - Approve registration (if pending)
  - Reject registration with reason

### 9.3 Drop/Add Management
**File:** `d:\edVerse\client\src\features\admin-registrations\DropAddManagement.tsx`

**Features:**
- [ ] View pending drop requests
- [ ] Approve drop with confirmation
- [ ] Reject drop with reason
- [ ] View add requests (if implemented)
- [ ] Comment/note field
- [ ] Status tracking (Pending/Approved/Rejected)

### 9.4 Registration Reports/Export
**File:** `d:\edVerse\client\src\features\admin-registrations\RegistrationExport.tsx`

**Export Options:**
- [ ] Export all registrations (CSV/Excel)
- [ ] Filter before export (by batch, section, course)
- [ ] Generate enrollment report per course
- [ ] Generate credit load report per student
- [ ] Generate statistics report

## 🎯 Acceptance Criteria

- [ ] Can set registration period
- [ ] Status updates correctly
- [ ] Can view all registrations
- [ ] Can handle drop requests
- [ ] Can export data
- [ ] All filters work
- [ ] No console errors

---

---

# PHASE 10: Complaint Management
**Duration:** 2 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Build complaint management system
- Create dashboard for complaints
- Implement assignment workflow
- Add resolution tracking

## ✅ Deliverables

### 10.1 Complaint Dashboard
**File:** `d:\edVerse\client\src\features\admin-complaints\ComplaintDashboard.tsx`

**Dashboard Stats:**
- [ ] Total Complaints (Count)
- [ ] Open Complaints (Count)
- [ ] In Progress (Count)
- [ ] Resolved (Count)
- [ ] Average Resolution Time (Days)
- [ ] Priority distribution (Pie chart)

### 10.2 Complaint List View
**File:** `d:\edVerse\client\src\features\admin-complaints\ComplaintList.tsx`

**Table Columns:**
- [ ] Complaint ID
- [ ] Title
- [ ] Submitted By (Student/Teacher name)
- [ ] Priority (High/Medium/Low - color-coded)
- [ ] Status (Open/In Progress/Resolved - badge)
- [ ] Category (Academic/Facility/Conduct/Other)
- [ ] Assigned To (Staff member name)
- [ ] Date Submitted
- [ ] Days Open (calculated)

**Filters:**
- [ ] By Status
- [ ] By Priority
- [ ] By Category
- [ ] By Assignee

**Sort:**
- [ ] By Date (newest first)
- [ ] By Priority (high first)
- [ ] By Days Open (oldest first)

**Actions:**
- [ ] View Detail button
- [ ] Assign button
- [ ] Mark as Resolved button

### 10.3 Complaint Detail View
**File:** `d:\edVerse\client\src\features\admin-complaints\ComplaintDetail.tsx`

**Sections:**

**A) Complaint Info:**
- [ ] ID, Title, Description
- [ ] Submitted By (with profile link)
- [ ] Date Submitted
- [ ] Category, Priority, Status
- [ ] Attachments (if any)

**B) Assignment:**
- [ ] Currently Assigned To (dropdown to change)
- [ ] Assignment Date
- [ ] Reassign button

**C) Timeline/Comments:**
- [ ] Chronological timeline
- [ ] Add comment button
- [ ] Each comment shows author, time, text
- [ ] Edit own comments

**D) Resolution:**
- [ ] Resolution textarea
- [ ] Mark as Resolved button
- [ ] Reopen button (if resolved)
- [ ] Change Priority dropdown

### 10.4 Assignment Workflow
**File:** `d:\edVerse\client\src\features\admin-complaints\AssignmentModal.tsx`

**Modal/Form:**
- [ ] Dropdown of available staff
- [ ] Current assignee
- [ ] Reassign confirmation
- [ ] Email notification checkbox
- [ ] Message field (optional)

## 🎯 Acceptance Criteria

- [ ] Complaint list displays
- [ ] Can view complaint details
- [ ] Can assign to staff
- [ ] Can add comments
- [ ] Can mark resolved
- [ ] All filters work
- [ ] No console errors

---

---

# PHASE 11: Announcements Management
**Duration:** 1-2 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Create announcement system
- Build announcement editor
- Setup publishing workflow
- Manage announcement scope

## ✅ Deliverables

### 11.1 Announcement List Page
**File:** `d:\edVerse\client\src\features\admin-announcements\AnnouncementList.tsx`

**Table Columns:**
- [ ] Title
- [ ] Scope (All/Students/Teachers/Department)
- [ ] Status (Draft/Published/Archived - badge)
- [ ] Created By (Admin name)
- [ ] Created Date
- [ ] Published Date (if published)
- [ ] Expiry Date

**Actions:**
- [ ] View/Edit (draft only)
- [ ] Publish (draft to published)
- [ ] Archive
- [ ] Delete (draft only)

**Filters:**
- [ ] By Status
- [ ] By Scope

### 11.2 Create/Edit Announcement Form
**File:** `d:\edVerse\client\src\features\admin-announcements\AnnouncementForm.tsx`

**Form Fields:**

**A) Basic Info:**
- [ ] Title (text input)
- [ ] Description/Summary (text area)

**B) Content:**
- [ ] Rich Text Editor (HTML/Markdown)
- [ ] File attachments (upload multiple)

**C) Scope:**
- [ ] Target All (radio)
- [ ] Target Students Only (radio + Batch/Section selector)
- [ ] Target Teachers Only (radio)
- [ ] Target Specific Course (radio + Course dropdown)

**D) Publishing:**
- [ ] Save as Draft button
- [ ] Publish button
- [ ] Publish Date (date picker, default today)
- [ ] Expiry Date (date picker, optional)

**E) Notifications:**
- [ ] Send Email Notification (checkbox)
- [ ] Send SMS (checkbox, if available)
- [ ] Pin to Top (checkbox)

### 11.3 Announcement Preview
**File:** `d:\edVerse\client\src\features\admin-announcements\AnnouncementPreview.tsx`

**Shows:**
- [ ] How announcement will appear to students
- [ ] Title, content, attachments
- [ ] Published date, expiry date
- [ ] Scope info

### 11.4 Announcement View (Published)
**File:** `d:\edVerse\client\src\features\admin-announcements\AnnouncementViewer.tsx`

**Shows:**
- [ ] Full announcement content
- [ ] Attachments
- [ ] Published date
- [ ] Edit button (for author)
- [ ] Archive button (for author)

## 🎯 Acceptance Criteria

- [ ] Can create announcement
- [ ] Rich text editor works
- [ ] Can set scope
- [ ] Can publish
- [ ] Can archive
- [ ] Can attach files
- [ ] Preview shows correctly
- [ ] No console errors

---

---

# PHASE 12: Exam Management (Optional Phase)
**Duration:** 2-3 Days
**Status:** ⏳ Waiting for Phase 1

## 📋 Phase Objectives
- Create exam schedule
- Track grade submissions
- Manage exam oversight

## ✅ Deliverables

### 12.1 Exam Schedule Creation
**File:** `d:\edVerse\client\src\features\admin-exams\ExamScheduleForm.tsx`

**Form:**
- [ ] Exam Type (Midterm/Final)
- [ ] Semester/Year
- [ ] Start Date & End Date
- [ ] Auto-generate schedule button
- [ ] Bulk schedule upload
- [ ] Preview before saving

### 12.2 Grade Submission Tracker
**File:** `d:\edVerse\client\src\features\admin-exams\GradeSubmissionTracker.tsx`

**Dashboard:**
- [ ] Which teachers submitted grades
- [ ] Which are overdue
- [ ] Send reminder button
- [ ] Days remaining display
- [ ] Course-wise tracking

### 12.3 Grade Approval (Optional)
**File:** `d:\edVerse\client\src\features\admin-exams\GradeApproval.tsx`

**Features:**
- [ ] View submitted grades
- [ ] Check grade distribution
- [ ] Flag suspicious distributions
- [ ] Approve/Reject grades
- [ ] Lock after approval
- [ ] Publish to students

## 🎯 Acceptance Criteria

- [ ] Can create exam schedule
- [ ] Can track grade submissions
- [ ] Can send reminders
- [ ] Can approve grades
- [ ] No console errors

---

---

# PHASE 13: Reports & Final Testing
**Duration:** 2 Days
**Status:** ⏳ Waiting for All Phases

## 📋 Phase Objectives
- Build report generation
- Create export functionality
- Final testing and polish

## ✅ Deliverables

### 13.1 Reports Dashboard
**File:** `d:\edVerse\client\src\features\admin-reports\ReportGeneration.tsx`

**Available Reports:**
- [ ] Enrollment Report (by course, section, batch)
- [ ] Attendance Report (by course, by student)
- [ ] Academic Performance (GPA distribution)
- [ ] Complaint Statistics
- [ ] Registration Statistics
- [ ] Teacher Workload
- [ ] Room Utilization

### 13.2 Report Export
**File:** `d:\edVerse\client\src\features\admin-reports\ReportExporter.tsx`

**Export Options:**
- [ ] PDF export
- [ ] Excel export
- [ ] CSV export
- [ ] Email report (optional)

## 🎯 Acceptance Criteria

- [ ] All reports generate correctly
- [ ] Export works (PDF, Excel, CSV)
- [ ] Data is accurate
- [ ] No console errors
- [ ] All previous phases working
- [ ] Final testing passed

---

---

# 📊 MASTER PHASE SUMMARY

| Phase | Name | Duration | Prerequisites | Status |
|-------|------|----------|---------------|--------|
| 1 | Base Infrastructure | 2-3 days | None | ⏳ Next |
| 2 | Dashboard | 2 days | Phase 1 | ⏳ Blocked |
| 3 | Teacher Management | 3 days | Phase 1 | ⏳ Blocked |
| 4 | Student Management | 3 days | Phase 1 | ⏳ Blocked |
| 5 | Course Management | 2 days | Phase 1 | ⏳ Blocked |
| 6 | Sections & Assignment | 2-3 days | Phases 1-5 | ⏳ Blocked |
| 7 | Routine/Schedule | 3 days | Phases 1-6 | ⏳ Blocked |
| 8 | Academic Calendar | 1-2 days | Phase 1 | ⏳ Blocked |
| 9 | Registration Control | 2-3 days | Phases 1-8 | ⏳ Blocked |
| 10 | Complaint Mgmt | 2 days | Phase 1 | ⏳ Blocked |
| 11 | Announcements | 1-2 days | Phase 1 | ⏳ Blocked |
| 12 | Exam Management | 2-3 days | Phase 1 | ⏳ Blocked |
| 13 | Reports & Testing | 2 days | All Phases | ⏳ Blocked |

**Total Duration:** 4-5 Weeks

---

---

# 🚀 HOW TO PROCEED

1. **Tell me to start PHASE 1**
2. I'll implement all Phase 1 deliverables
3. After completion, **verify the checklist**
4. Once verified ✅, proceed to next phase
5. Repeat until all phases complete

**To Start:** Message "Start PHASE 1" and I'll begin!

---

**Document Version:** 2.0
**Last Updated:** February 3, 2026
**Next Update:** After Phase 1 Completion
