# Student Classroom - Implementation Plan
**Generated**: February 2, 2026  
**Project**: edVerse - Student Classroom Module  
**Status**: Planning Phase  
**Type**: Feature Development Roadmap  
**Synchronization**: Teacher Panel Classroom (Synchronized)

---

## 📋 Executive Summary

Student Classroom হবে edVerse এর একটি major module যেখানে students তাদের teachers দের announcements, materials, assignments দেখতে পারবে। এটি Teacher Panel এর Classroom এর সাথে completely synchronized থাকবে এবং real-time updates পাবে।

---

## 🎯 Features Overview

### **Core Features**
1. ✅ **View Class Feed** - Teacher দের posts দেখুন
2. ✅ **Filter Posts** - Type অনুযায়ী filter করুন
3. ✅ **View Announcements** - Messages এবং updates
4. ✅ **Access Materials** - PDFs, documents download করুন
5. ✅ **View Assignments** - Due dates সহ tasks দেখুন
6. ✅ **Submit Assignments** - Files attach করে submit করুন
7. ✅ **Track Submission Status** - Submitted/Late indicators
8. ✅ **Comments on Posts** - Teacher এর সাথে discuss করুন
9. ✅ **Mark as Read** - Posts দেখেছেন indicator

### **Advanced Features**
10. ✅ **Assignment Submissions** - Multiple file submission
11. ✅ **Late Submission Detection** - Automatic late flag
12. ✅ **Download Materials** - Bulk download option
13. ✅ **Notifications** - New posts, assignment due dates
14. ✅ **Search & Filter** - Find posts quickly

---

## 🔄 Synchronization with Teacher Panel

### **Data Flow: Teacher → Student**

```
Teacher Action                          Student View (Sync)
─────────────────────────────────────────────────────────────────
Create Announcement (POST)      →   View in Feed (Instant)
Upload Material (POST)          →   Download available (Instant)
Create Assignment (POST)        →   See task + due date (Instant)
Set Due Date                    →   Countdown timer (Instant)
Pin Post                        →   Shows at top (Instant)
```

### **Data Flow: Student → Teacher**

```
Student Action                          Teacher View (Sync)
─────────────────────────────────────────────────────────────────
View Post (Mark as Read)        →   Seen in viewers list
Submit Assignment                →   Submission recorded
Mark Submission (Late/On-time)   →   Auto-detected
Add Comment                      →   Notification to teacher
Download Material                →   Optional tracking
```

### **Real-time Synchronization Points**

1. **Classroom Posts Collection** (Shared)
   ```
   Teacher creates/updates → Database updated
   → Student API fetch → UI updates (auto-refresh every 30s or on-focus)
   ```

2. **Submissions Collection** (Sub-document in ClassroomPost)
   ```
   Student submits file → Added to post.submissions[]
   → Teacher sees immediately in /submissions endpoint
   ```

3. **Comments Collection** (Sub-document in ClassroomPost)
   ```
   Student/Teacher comments → Added to post.comments[]
   → Both sides see immediately (with refresh)
   ```

---

## 📁 File Structure

```
client/src/
├── features/
│   └── student-classroom/
│       ├── StudentClassroom.tsx          # Main feed page
│       ├── StudentPostCard.tsx           # Post display (read-only for students)
│       ├── SubmissionModal.tsx           # File submission form
│       ├── SubmissionStatus.tsx          # Show submission status
│       ├── AssignmentDetail.tsx          # Full assignment view
│       ├── CommentSection.tsx            # Comments (shared with teacher)
│       ├── MaterialDownload.tsx          # Download materials
│       └── NotificationCenter.tsx        # Due date reminders
│
└── services/
    └── classroomService.ts              # API calls to classroom endpoints
```

---

## 🏗️ Database Collections (Shared with Teacher)

### **ClassroomPost** (Already exists from Teacher)
```javascript
{
  _id: ObjectId,
  teacherId: String,
  courseCode: String,
  sections: [String],           // Student's section must match
  type: String,                 // 'announcement' | 'material' | 'assignment'
  title: String,
  content: String,
  attachments: [{               // Teacher's files
    fileName: String,
    fileUrl: String,
    fileSize: Number
  }],
  dueDate: Date,                // For assignments
  isPinned: Boolean,
  viewedBy: [String],           // Student IDs who viewed
  submissions: [{               // Students' file submissions
    studentId: String,
    studentName: String,
    submittedAt: Date,
    files: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number
    }],
    isLate: Boolean
  }],
  comments: [{
    userId: String,
    userRole: String,           // 'student' | 'teacher'
    userName: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI/UX Design Specifications

### **Color Palette (Same as Student)**
- Primary: #0C2B4E
- Secondary: #1A3D64
- Accent: #1D546C
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Danger: #EF4444 (Red)

### **Layout Structure**

```
┌──────────────────────────────────────┐
│  Student Classroom                   │
├──────────────────────────────────────┤
│ Course Selector | Section | Filter   │
├──────────────────────────────────────┤
│                                      │
│  [Pinned Post - Announcement]       │
│  ┌──────────────────────────────┐   │
│  │ 📢 Teacher Name              │   │
│  │ Today at 2:15 PM             │   │
│  │ ─────────────────────────────│   │
│  │ Greetings - Welcome Everyone │   │
│  │ Content...                   │   │
│  │ [👁 Viewed] [💬 0 comments]  │   │
│  └──────────────────────────────┘   │
│                                      │
│  [Regular Post - Material]           │
│  ┌──────────────────────────────┐   │
│  │ 📄 Teacher Name              │   │
│  │ Yesterday                    │   │
│  │ ─────────────────────────────│   │
│  │ Chapter 5 - Data Structures  │   │
│  │ [📎 Attachment PDF]          │   │
│  │ [⬇️ Download] [💬 2 comments]│   │
│  └──────────────────────────────┘   │
│                                      │
│  [Assignment Post with Submission]   │
│  ┌──────────────────────────────┐   │
│  │ 📝 Teacher Name              │   │
│  │ 3 days ago                   │   │
│  │ ─────────────────────────────│   │
│  │ Assignment 3: Linked Lists   │   │
│  │ Due: Feb 5, 2026 (2 days)   │   │
│  │ [📎 PDF Attachment]          │   │
│  │                              │   │
│  │ ✅ You submitted:            │   │
│  │ [📎 LinkedList.cpp] 45 KB    │   │
│  │ Feb 2, 2:30 PM (On-time)     │   │
│  │ [Resubmit]                   │   │
│  │ [💬 3 comments]              │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

### **Component States**

#### **Post Card States:**
1. **Announcement** - Blue, no submission area
2. **Material** - Green, download button, no submission
3. **Assignment (Not Submitted)** - Orange, show "Submit" button
4. **Assignment (Submitted On-time)** - Green badge + file info
5. **Assignment (Submitted Late)** - Red badge + late indicator
6. **Assignment (Past Due, Not Submitted)** - Red warning

#### **Submission Status Indicators:**
- ✅ **On-time** - Green badge
- ⚠️ **Late** - Red badge
- 📤 **Not Submitted** - Gray button
- 🔄 **Resubmitted** - Timestamp update

---

## 📡 API Endpoints (Using Existing Teacher API)

### **Read Operations (Student Side)**

```
GET /api/classroom/course/:courseCode?section=A
  - Returns all posts for student's course/section
  - Filter by sections array matching
  - Sorted by isPinned DESC, createdAt DESC

GET /api/classroom/:postId
  - Get single post details
  - Include submissions and comments
  - Auto-mark as viewed via next endpoint

POST /api/classroom/:postId/view
  - Mark post as viewed by student
  - Add studentId to post.viewedBy[]
  - Called on post display
```

### **Write Operations (Student Side)**

```
POST /api/classroom/:postId/submit
  - Submit assignment files
  - Body: {
      studentId: "2024510183",
      studentName: "Student Name",
      files: [{ fileName, fileUrl, fileSize, fileType }]
    }
  - Auto-sets isLate if current time > post.dueDate
  - Creates/updates submission in post.submissions[]

POST /api/classroom/:postId/comments
  - Add comment as student
  - Body: {
      userId: studentId,
      userRole: "student",
      userName: studentName,
      text: "comment text"
    }
  - Adds to post.comments[] array

GET /api/classroom/:postId/submission/:studentId
  - Get student's submission for assignment
  - Used to check if already submitted + show status
```

---

## 🔄 Implementation Phases

### **Phase 1: Core Student Classroom View** (Days 1-2)
**Goal**: Display teacher posts, basic filtering

**Tasks:**
- [ ] Create StudentClassroom.tsx main page
- [ ] Add course & section selectors
- [ ] Create StudentPostCard.tsx (read-only version)
- [ ] Implement post filtering (Announcements, Materials, Assignments)
- [ ] Add view tracking (POST /api/classroom/:postId/view)
- [ ] Implement localStorage caching
- [ ] Add loading & empty states
- [ ] Create material download buttons

**Files to Create:**
- `client/src/features/student-classroom/StudentClassroom.tsx`
- `client/src/features/student-classroom/StudentPostCard.tsx`
- `client/src/services/classroomService.ts`

**API Calls:**
- `GET /api/classroom/course/:courseCode`
- `POST /api/classroom/:postId/view`

---

### **Phase 2: Assignment Submission System** (Days 2-3)
**Goal**: Students submit assignment files

**Tasks:**
- [ ] Create SubmissionModal.tsx component
- [ ] Add file upload with drag-drop
- [ ] Show submission status on post
- [ ] Detect late submissions automatically
- [ ] Allow resubmission
- [ ] Show previous submissions
- [ ] Display student submission on card
- [ ] Add submission timestamp tracking

**Files to Create:**
- `client/src/features/student-classroom/SubmissionModal.tsx`
- `client/src/features/student-classroom/SubmissionStatus.tsx`

**API Calls:**
- `POST /api/classroom/:postId/submit`
- `GET /api/classroom/:postId/submission/:studentId`

---

### **Phase 3: Comments & Interaction** (Days 3-4)
**Goal**: Students comment on posts

**Tasks:**
- [ ] Implement CommentSection component
- [ ] Show all comments on post
- [ ] Add new comment input
- [ ] Delete own comments
- [ ] Show teacher role badge
- [ ] Add timestamp formatting
- [ ] Real-time refresh (optional)

**Files to Modify:**
- `client/src/features/student-classroom/CommentSection.tsx` (reuse from teacher)

**API Calls:**
- `POST /api/classroom/:postId/comments`
- `DELETE /api/classroom/:postId/comments/:commentIndex`

---

### **Phase 4: Notifications & Due Date Reminders** (Days 4-5)
**Goal**: Alert students about due dates

**Tasks:**
- [ ] Create NotificationCenter component
- [ ] Add assignment countdown timers
- [ ] Show due date warnings (24h, 12h, 1h before)
- [ ] Push notifications (if enabled)
- [ ] Notification history page
- [ ] Mark notification as read
- [ ] Sound alerts for important updates

**Files to Create:**
- `client/src/features/student-classroom/NotificationCenter.tsx`

---

### **Phase 5: Advanced Features** (Days 5-6)
**Goal**: Search, bulk download, better UX

**Tasks:**
- [ ] Implement post search functionality
- [ ] Add bulk material download
- [ ] Create assignment detail modal
- [ ] Add progress tracking (submitted/pending)
- [ ] Create assignment submission history view
- [ ] Add submission statistics
- [ ] Implement auto-refresh (every 30s)
- [ ] Add mark as unread functionality

**Files to Create:**
- `client/src/features/student-classroom/AssignmentDetail.tsx`
- `client/src/features/student-classroom/MaterialDownload.tsx`

---

### **Phase 6: Testing & Polish** (Days 6-7)
**Goal**: Full testing and synchronization verification

**Tasks:**
- [ ] Test all CRUD operations
- [ ] Verify teacher-student sync
- [ ] Test offline functionality
- [ ] Check submission late detection
- [ ] Test comment synchronization
- [ ] Performance optimization
- [ ] Fix responsive design
- [ ] Full integration testing

---

## 🔐 Data Validation & Security

### **Student Side Validation:**
```typescript
// Only show posts where:
- post.sections includes student's section OR
- post.sections includes 'All'

// Only allow submission if:
- Post type === 'assignment'
- Student authenticated
- File size < 50MB
- Max 5 files per submission

// Only show/delete own comments
- userId === currentUser.id

// Track view only once per student
- Don't add duplicate to viewedBy[]
```

---

## 📊 Synchronization Verification

### **Real-time Sync Checklist:**

```
Teacher Creates Post
  ↓
API saves to database
  ↓
Student refreshes classroom
  ↓
GET /api/classroom/course/:courseCode
  ↓
Post appears in student's feed ✅

─────────────────────────────────────

Student Submits Assignment
  ↓
POST /api/classroom/:postId/submit
  ↓
API updates post.submissions[]
  ↓
Teacher refreshes classroom
  ↓
Gets updated from GET /api/classroom/:postId/submissions ✅

─────────────────────────────────────

Student/Teacher Comments
  ↓
POST /api/classroom/:postId/comments
  ↓
API updates post.comments[]
  ↓
Both refresh and see new comment ✅
```

---

## 🎓 Student Classroom Route

```typescript
// Add to App.tsx routes
<Route
  path="/student/classroom"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentClassroom />
    </ProtectedRoute>
  }
/>

// Add to student sidebar navigation
{ label: 'Classroom', href: '/student/classroom', icon: <BookOpen /> }
```

---

## 🚀 Key Implementation Notes

### **1. Lazy Loading Posts**
- Load pinned posts first (isPinned: true)
- Then load regular posts (createdAt DESC)
- Implement pagination (20 posts per page)

### **2. Image/File Handling**
- Use Blob URLs for immediate display
- Store references in localStorage
- Load from API on refresh

### **3. Auto-Refresh Strategy**
- Refresh every 30 seconds in background
- Refresh on page focus
- Manual refresh button
- WebSocket optional (nice to have)

### **4. Offline Support**
- Cache posts in localStorage
- Show cached version if offline
- Queue submissions for when online
- Sync when connection restored

### **5. Performance**
- Virtualize long lists
- Lazy load images
- Compress files before upload
- Debounce search

---

## 📱 Responsive Design

```
Mobile (< 640px)
  - Single column
  - Larger tap targets
  - Full-width buttons
  - Stacked file list

Tablet (640px - 1024px)
  - Single column with margins
  - Sidebar hidden (toggle menu)
  - Side-by-side controls

Desktop (> 1024px)
  - Main content area
  - Optional sidebar
  - Multi-column layout
```

---

## 🔄 Synchronization Testing Scenarios

### **Scenario 1: Teacher Posts While Student Viewing**
```
1. Student views classroom
2. Teacher creates new post
3. Student refreshes (manual or auto)
4. New post appears at top ✅
```

### **Scenario 2: Student Submits, Teacher Reviews**
```
1. Student submits assignment
2. Teacher refreshes /teacher/courses
3. Teacher sees submission in CourseOverview
4. Teacher clicks assignment post
5. Sees student submission in submissions list ✅
```

### **Scenario 3: Late Submission Detection**
```
1. Assignment due Feb 5, 2:00 PM
2. Student submits Feb 5, 3:00 PM
3. System auto-sets isLate: true
4. Teacher sees "Late" badge ✅
5. Student sees late warning ✅
```

### **Scenario 4: Comments Back-and-Forth**
```
1. Student comments on post
2. Teacher refreshes and sees comment
3. Teacher replies in comment
4. Student refreshes and sees reply
5. Both see threaded comments ✅
```

---

## 📋 Checklist for Synchronization

- [ ] Student views match teacher's posted data
- [ ] Submissions appear in teacher's submissions list
- [ ] Comments sync both ways
- [ ] Late detection automatic
- [ ] File downloads work
- [ ] Offline mode functional
- [ ] localStorage backup works
- [ ] Real-time feel with auto-refresh
- [ ] No data loss on network errors
- [ ] Performance optimized

---

**Last Updated**: February 2, 2026  
**Status**: Planning Complete - Ready for Implementation  
**Estimated Total Time**: 7 days

---

## 🎯 Next Steps

1. ✅ **Review this plan** with team
2. ✅ **Adjust based on feedback**
3. 🔄 **Start Phase 1 implementation**
4. 🔄 **Parallel work on database optimization**
5. 🔄 **Setup real-time sync testing**
