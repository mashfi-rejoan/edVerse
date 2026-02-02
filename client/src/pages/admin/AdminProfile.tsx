import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

interface AdminInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  photo?: string;
  joinDate: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminProfile();
      if (response.success) {
        setProfile(response.data);
        if (response.data.photo) {
          setPhotoPreview(response.data.photo);
        }
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      const response = await adminService.uploadProfilePhoto(file);
      if (response.success) {
        setSuccess('Photo updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to upload photo');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] flex items-center justify-center text-white relative group">
              {photoPreview ? (
                <img src={photoPreview} alt={profile?.fullName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <User size={48} />
              )}
              <label className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                <Camera size={24} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.fullName}</h1>
              <p className="text-gray-600">{profile?.designation}</p>
              <p className="text-sm text-gray-500 mt-1">Joined {profile?.joinDate}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              {success}
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{profile?.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">
                    {profile?.address}, {profile?.city}, {profile?.state} {profile?.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{profile?.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">{profile?.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin ID</p>
                <p className="font-medium text-gray-900 font-mono text-sm">{profile?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminProfile;
