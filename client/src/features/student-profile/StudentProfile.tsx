import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import authService from '../../services/authService';
import studentService from '../../services/studentService';
import { apiUrl } from '../../utils/apiBase';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Briefcase, 
  Award,
  Users,
  Home,
  Heart,
  Building,
  GraduationCap,
  BookOpen
} from 'lucide-react';

const StudentProfile = () => {
  const user = authService.getCurrentUser();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: user?.name || 'Karim Ahmed',
    studentId: user?.universityId || 'STD-2024-001',
    email: user?.email || 'karim.ahmed@student.edverse.edu',
    phone: '+880 1700-987654',
    dateOfBirth: '2004-03-20',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    
    // Academic Information
    department: 'Computer Science and Engineering',
    program: 'Bachelor of Science',
    batch: '2024',
    semester: 'Spring 2026',
    section: '1',
    admissionDate: '2024-01-10',
    cgpa: '3.75',
    completedCredits: '48',
    
    // Address Information
    presentAddress: {
      street: 'House 12, Road 5, Block C',
      city: 'Dhaka',
      district: 'Dhaka',
      division: 'Dhaka',
      postalCode: '1207',
      country: 'Bangladesh'
    },
    permanentAddress: {
      street: 'Village: Gopalpur, PO: Gopalpur',
      city: 'Jessore',
      district: 'Jessore',
      division: 'Khulna',
      postalCode: '7400',
      country: 'Bangladesh'
    },
    
    // Family Information
    fatherName: 'Md. Rafiq Ahmed',
    fatherOccupation: 'Business',
    fatherPhone: '+880 1800-111222',
    motherName: 'Rahima Khatun',
    motherOccupation: 'Teacher',
    motherPhone: '+880 1900-333444',
    
    // Guardian Information (if different from parents)
    guardianName: 'Md. Rafiq Ahmed',
    guardianRelation: 'Father',
    guardianOccupation: 'Business',
    guardianPhone: '+880 1800-111222',
    
    // Emergency Contact
    emergencyContactName: 'Md. Rafiq Ahmed',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+880 1800-111222',
    
    // Additional Information
    maritalStatus: 'Single',
    languages: 'Bengali, English',
    hobbies: 'Programming, Reading, Gaming',
    extracurricular: 'Programming Club, Debate Society'
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await studentService.getProfile();
        if (response.success && response.data) {
          const student = response.data;
          const userData = student.userId || {};
          setProfileData((prev) => ({
            ...prev,
            fullName: userData.name || prev.fullName,
            studentId: student.universityId || userData.universityId || prev.studentId,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            bloodGroup: student.bloodGroup || prev.bloodGroup,
            department: student.department || prev.department,
            batch: student.batch || prev.batch,
            section: student.section || prev.section,
            cgpa: student.cgpa?.toString() || prev.cgpa,
            completedCredits: student.completedCredits?.toString() || prev.completedCredits,
            admissionDate: student.admissionDate || prev.admissionDate
          }));
          setProfilePhoto(userData.photoUrl ? apiUrl(userData.photoUrl) : null);
        }
      } catch (error) {
        console.error('Failed to load student profile:', error);
      }
    };

    loadProfile();

    const handlePhotoUpdate = () => {
      const updatedUser = authService.getCurrentUser();
      setProfilePhoto(updatedUser?.photoUrl ? apiUrl(updatedUser.photoUrl) : null);
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
  }, []);

  const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-[#0C2B4E] mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="My Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] rounded-xl p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={80} className="text-white/60" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profileData.fullName}</h1>
              <p className="text-blue-200 text-lg mb-1">{profileData.program} in {profileData.department}</p>
              <p className="text-blue-300 text-sm">Batch {profileData.batch} • Section {profileData.section}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {profileData.studentId}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  CGPA: {profileData.cgpa}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserCircle size={24} className="text-[#0C2B4E]" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Mail size={18} />} label="Email Address" value={profileData.email} />
            <InfoCard icon={<Phone size={18} />} label="Phone Number" value={profileData.phone} />
            <InfoCard icon={<Calendar size={18} />} label="Date of Birth" value={new Date(profileData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoCard icon={<Users size={18} />} label="Gender" value={profileData.gender} />
            <InfoCard icon={<Heart size={18} />} label="Blood Group" value={profileData.bloodGroup} />
            <InfoCard icon={<MapPin size={18} />} label="Nationality" value={profileData.nationality} />
            <InfoCard icon={<Users size={18} />} label="Religion" value={profileData.religion} />
            <InfoCard icon={<Users size={18} />} label="Marital Status" value={profileData.maritalStatus} />
            <InfoCard icon={<Users size={18} />} label="Languages Known" value={profileData.languages} />
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap size={24} className="text-[#0C2B4E]" />
            Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<CreditCard size={18} />} label="Student ID" value={profileData.studentId} />
            <InfoCard icon={<Building size={18} />} label="Department" value={profileData.department} />
            <InfoCard icon={<GraduationCap size={18} />} label="Program" value={profileData.program} />
            <InfoCard icon={<BookOpen size={18} />} label="Current Semester" value={profileData.semester} />
            <InfoCard icon={<Users size={18} />} label="Batch" value={profileData.batch} />
            <InfoCard icon={<Users size={18} />} label="Section" value={profileData.section} />
            <InfoCard icon={<Calendar size={18} />} label="Admission Date" value={new Date(profileData.admissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoCard icon={<Award size={18} />} label="CGPA" value={profileData.cgpa} />
            <InfoCard icon={<BookOpen size={18} />} label="Completed Credits" value={profileData.completedCredits} />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={24} className="text-[#0C2B4E]" />
            Address Information
          </h2>
          
          <div className="space-y-6">
            {/* Present Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Present Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={<Home size={18} />} label="Street Address" value={profileData.presentAddress.street} />
                <InfoCard icon={<MapPin size={18} />} label="City" value={profileData.presentAddress.city} />
                <InfoCard icon={<MapPin size={18} />} label="District" value={profileData.presentAddress.district} />
                <InfoCard icon={<MapPin size={18} />} label="Division" value={profileData.presentAddress.division} />
                <InfoCard icon={<MapPin size={18} />} label="Postal Code" value={profileData.presentAddress.postalCode} />
                <InfoCard icon={<MapPin size={18} />} label="Country" value={profileData.presentAddress.country} />
              </div>
            </div>

            {/* Permanent Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={<Home size={18} />} label="Street Address" value={profileData.permanentAddress.street} />
                <InfoCard icon={<MapPin size={18} />} label="City" value={profileData.permanentAddress.city} />
                <InfoCard icon={<MapPin size={18} />} label="District" value={profileData.permanentAddress.district} />
                <InfoCard icon={<MapPin size={18} />} label="Division" value={profileData.permanentAddress.division} />
                <InfoCard icon={<MapPin size={18} />} label="Postal Code" value={profileData.permanentAddress.postalCode} />
                <InfoCard icon={<MapPin size={18} />} label="Country" value={profileData.permanentAddress.country} />
              </div>
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={24} className="text-[#0C2B4E]" />
            Family Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Father's Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Father's Information</h3>
              <div className="space-y-3">
                <InfoCard icon={<Users size={18} />} label="Father's Name" value={profileData.fatherName} />
                <InfoCard icon={<Briefcase size={18} />} label="Occupation" value={profileData.fatherOccupation} />
                <InfoCard icon={<Phone size={18} />} label="Phone Number" value={profileData.fatherPhone} />
              </div>
            </div>

            {/* Mother's Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Mother's Information</h3>
              <div className="space-y-3">
                <InfoCard icon={<Users size={18} />} label="Mother's Name" value={profileData.motherName} />
                <InfoCard icon={<Briefcase size={18} />} label="Occupation" value={profileData.motherOccupation} />
                <InfoCard icon={<Phone size={18} />} label="Phone Number" value={profileData.motherPhone} />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoCard icon={<Users size={18} />} label="Guardian Name" value={profileData.guardianName} />
              <InfoCard icon={<Users size={18} />} label="Relation" value={profileData.guardianRelation} />
              <InfoCard icon={<Briefcase size={18} />} label="Occupation" value={profileData.guardianOccupation} />
              <InfoCard icon={<Phone size={18} />} label="Phone Number" value={profileData.guardianPhone} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard icon={<Users size={18} />} label="Contact Name" value={profileData.emergencyContactName} />
              <InfoCard icon={<Users size={18} />} label="Relation" value={profileData.emergencyContactRelation} />
              <InfoCard icon={<Phone size={18} />} label="Phone Number" value={profileData.emergencyContactPhone} />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={24} className="text-[#0C2B4E]" />
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={<Award size={18} />} label="Hobbies & Interests" value={profileData.hobbies} />
            <InfoCard icon={<Users size={18} />} label="Extracurricular Activities" value={profileData.extracurricular} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
