# Admin Panel - Phase 1 Quick Reference Guide

## 🚀 Getting Started

### Accessing Admin Panel
```
Base URL: /admin/dashboard
Protected: Yes (requires admin/super-admin role)
```

### Navigation Structure
- `/admin/dashboard` - Main dashboard with statistics
- `/admin/profile` - Admin profile and photo upload
- `/admin/settings` - Settings and preferences
- `/admin/teachers` - Teacher management (example)
- `/admin/students` - Student management (example)
- `/admin/courses` - Course management (example)

## 📦 Component Usage Examples

### 1. DataTable Component
```tsx
import DataTable from '../components/DataTable';

<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' }
  ]}
  data={data}
  searchable
  searchFields={['name', 'email']}
  actions={[
    { label: 'Edit', onClick: handleEdit, color: 'blue' },
    { label: 'Delete', onClick: handleDelete, color: 'red' }
  ]}
/>
```

### 2. AdminForm Component
```tsx
import AdminForm, { FormField } from '../components/AdminForm';

const fields: FormField[] = [
  { 
    name: 'email', 
    label: 'Email', 
    type: 'email', 
    required: true,
    validation: (value) => value.includes('@') ? null : 'Invalid email'
  }
];

<AdminForm
  fields={fields}
  onSubmit={handleSubmit}
  onCancel={onCancel}
  submitText="Save"
/>
```

### 3. AdminModal Component
```tsx
import AdminModal from '../components/AdminModal';

<AdminModal
  title="Add New Item"
  open={showModal}
  onClose={() => setShowModal(false)}
  size="lg"
>
  <YourContent />
</AdminModal>
```

### 4. StatCard Component
```tsx
import StatCard from '../components/StatCard';
import { Users } from 'lucide-react';

<StatCard
  title="Total Students"
  value={245}
  icon={<Users size={24} />}
  color="blue"
  trend={{ value: 12, isPositive: true }}
  subtitle="Active students"
/>
```

### 5. PageHeader Component
```tsx
import PageHeader from '../components/PageHeader';
import { Plus } from 'lucide-react';

<PageHeader
  title="Students Management"
  subtitle="Manage all students"
  breadcrumb={['Admin', 'Students']}
  icon={<Plus size={24} />}
  action={{
    label: 'Add Student',
    onClick: () => setShowModal(true),
    variant: 'primary'
  }}
/>
```

### 6. LoadingSpinner Component
```tsx
import LoadingSpinner from '../components/LoadingSpinner';

// Inline spinner
<LoadingSpinner size="md" text="Loading..." />

// Full screen spinner
<LoadingSpinner fullScreen size="lg" text="Verifying access..." />
```

### 7. EmptyState Component
```tsx
import EmptyState from '../components/EmptyState';
import { Users } from 'lucide-react';

<EmptyState
  icon={<Users size={48} className="text-gray-400" />}
  title="No students found"
  description="Start by adding a new student to your system"
  action={{
    label: 'Add Student',
    onClick: () => setShowModal(true)
  }}
/>
```

## 🔐 API Service Usage

### Import Service
```tsx
import adminService from '../services/adminService';
```

### Common Operations

#### Get Data with Pagination
```tsx
const response = await adminService.getStudents(page, limit);
if (response.success) {
  setData(response.data);
}
```

#### Create Item
```tsx
const response = await adminService.createTeacher({
  fullName: 'John Doe',
  email: 'john@example.com',
  // ...
});
```

#### Update Item
```tsx
const response = await adminService.updateStudent(studentId, {
  email: 'newemail@example.com'
});
```

#### Delete Item
```tsx
const response = await adminService.deleteTeacher(teacherId);
```

#### Upload Profile Photo
```tsx
const response = await adminService.uploadProfilePhoto(file);
```

## 🎨 Styling Reference

### Primary Colors
```
Primary: #0C2B4E (dark blue)
Secondary: #1A3D64 (lighter blue)
Accent: #1D546C (teal)
```

### Common Tailwind Classes
- Buttons: `bg-[#0C2B4E] text-white hover:bg-[#0a1f37]`
- Borders: `border border-gray-300 rounded-lg`
- Padding: `p-6` (default section padding)
- Shadows: `shadow-sm` (light), `shadow-lg` (heavy)

### StatCard Colors
```
color="blue"    - Blue cards
color="green"   - Green cards
color="red"     - Red cards
color="yellow"  - Yellow cards
```

## ✅ Form Validation

### Built-in Validations
- `required: true` - Field must have value
- Custom validation function

### Example with Custom Validation
```tsx
{
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true,
  validation: (value) => {
    if (value.length < 6) return 'Min 6 characters';
    return null; // Valid
  }
}
```

## 🛡️ Protection & Authentication

### Route Protection
All admin routes are wrapped with `<ProtectedAdminRoute>`:
```tsx
<Route path="/admin/teachers">
  <ProtectedAdminRoute>
    <TeacherManagement />
  </ProtectedAdminRoute>
</Route>
```

### Check User Role
```tsx
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.role !== 'admin' && user.role !== 'super-admin') {
  // Handle unauthorized
}
```

### Token Management
Token is automatically added to all API requests via interceptor.

## 📝 Creating a New Management Page

### 1. Create Component
```tsx
// src/pages/admin/SectionManagement.tsx
import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';

const SectionManagement: React.FC = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ... implementation
  
  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <PageHeader title="Sections" />
        <DataTable columns={columns} data={items} />
      </div>
    </AdminDashboardLayout>
  );
};

export default SectionManagement;
```

### 2. Add Route
```tsx
// In App.tsx
<Route path="/admin/sections">
  <ProtectedAdminRoute>
    <SectionManagement />
  </ProtectedAdminRoute>
</Route>
```

### 3. Add to Sidebar Navigation
Update AdminDashboardLayout.tsx navItems array to include new route.

## 🐛 Common Issues & Solutions

### Issue: Import Path Errors
**Solution:** Check file is in correct location
- Components: `src/components/`
- Pages: `src/pages/admin/`
- Services: `src/services/`

### Issue: API Calls Returning 401
**Solution:** Token expired - user needs to re-login
- ProtectedAdminRoute will handle redirect

### Issue: Form Not Validating
**Solution:** Check validation function returns error string or null
```tsx
validation: (value) => value ? null : 'Field required'
```

### Issue: Modal Not Showing
**Solution:** Ensure `open` prop is true and `onClose` is defined

### Issue: Responsive Design Broken
**Solution:** Check Tailwind breakpoints used in DataTable and components

## 📊 Data Structures

### User Object
```ts
{
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'super-admin' | 'student' | 'teacher';
  photo?: string;
  joinDate?: string;
}
```

### ApiResponse Type
```ts
{
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### FormField Interface
```ts
{
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date';
  required?: boolean;
  placeholder?: string;
  validation?: (value: any) => string | null;
  options?: { label: string; value: string }[];
  defaultValue?: string;
}
```

## 🔄 Error Handling Pattern

```tsx
try {
  setLoading(true);
  const response = await adminService.getItems();
  if (response.success) {
    setItems(response.data);
  }
} catch (err) {
  setError('Failed to load items');
  console.error(err);
} finally {
  setLoading(false);
}
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Grid layouts:
- 1 column on mobile
- 2 columns on tablet
- 3-4 columns on desktop

---

**For detailed documentation, see PHASE_1_COMPLETION.md**
