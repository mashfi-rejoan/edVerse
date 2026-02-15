import { useEffect, useRef, useState } from 'react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import authService from '../../services/authService';
import teacherService from '../../services/teacherService';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { apiUrl } from '../../utils/apiBase';

const TeacherSettings = () => {
  const user = authService.getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    teacherId: user?.id || '',
    department: 'Computer Science',
    designation: 'Assistant Professor'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await teacherService.getProfile();
        if (response.success && response.data) {
          const teacher = response.data;
          const userData = teacher.userId || {};
          setProfile((prev) => ({
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            teacherId: teacher.universityId || userData.universityId || prev.teacherId,
            department: teacher.department || prev.department,
            designation: teacher.designation || prev.designation
          }));
          setProfilePhoto(userData.photoUrl ? apiUrl(userData.photoUrl) : null);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await teacherService.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone
      });

      if (response.success && response.data?.userId) {
        const updatedUser = response.data.userId;
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...currentUser,
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
              photoUrl: updatedUser.photoUrl || currentUser.photoUrl
            })
          );
        }
      }
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long!');
      return;
    }

    try {
      await teacherService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccessMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to change password. Please try again.');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await teacherService.uploadPhoto(formData);
      if (response.success && response.data?.photoUrl) {
        const url = apiUrl(response.data.photoUrl);
        setProfilePhoto(url);
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...currentUser,
              photoUrl: response.data.photoUrl
            })
          );
        }
        window.dispatchEvent(new Event('profilePhotoUpdated'));
        setSuccessMessage('Profile photo updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to upload photo. Please try again.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage('Failed to upload photo. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <TeacherDashboardLayout title="Settings">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={20} />
            Profile Information
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-500">
                  {profile.name?.charAt(0) || 'T'}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">Upload profile photo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] text-sm font-medium"
              >
                Upload Photo
              </button>
            </div>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher ID
                </label>
                <input
                  type="text"
                  value={profile.teacherId}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={profile.department}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={profile.designation}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] font-medium"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={20} />
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] font-medium"
            >
              Change Password
            </button>
          </form>
        </div>

      </div>
    </TeacherDashboardLayout>
  );
};

export default TeacherSettings;
