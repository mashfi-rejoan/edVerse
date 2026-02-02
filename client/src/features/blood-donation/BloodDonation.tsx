import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { HeartPulse, Droplet, MapPin, Edit2 } from 'lucide-react';
import { apiUrl } from '../../utils/apiBase';

interface BloodDonation {
  _id: string;
  studentId: string;
  donorName: string;
  bloodType: string;
  contact: string;
  currentAddress: string;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  isAvailable: boolean;
  status: string;
}

// Mock data for demo purposes (will be replaced with actual API data when available)
const mockDonors: BloodDonation[] = [
  {
    _id: '1',
    studentId: '2022-1-60-001',
    donorName: 'Ahmed Hassan',
    bloodType: 'O+',
    contact: '01712345678',
    currentAddress: 'House 12, Road 5, Dhanmondi, Dhaka',
    lastDonationDate: '2025-11-15',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '2',
    studentId: '2022-1-60-015',
    donorName: 'Fatima Rahman',
    bloodType: 'A+',
    contact: '01823456789',
    currentAddress: 'Flat 3B, Green View Apartment, Mirpur-10, Dhaka',
    lastDonationDate: '2025-12-01',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '3',
    studentId: '2022-1-60-028',
    donorName: 'Kamal Hossain',
    bloodType: 'B+',
    contact: '01934567890',
    currentAddress: 'House 45, Sector 7, Uttara, Dhaka',
    lastDonationDate: '2025-10-20',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '4',
    studentId: '2022-1-60-042',
    donorName: 'Nusrat Jahan',
    bloodType: 'AB+',
    contact: '01645678901',
    currentAddress: 'House 23, Road 11, Banani, Dhaka',
    lastDonationDate: '2025-09-10',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '5',
    studentId: '2022-1-60-056',
    donorName: 'Rakib Islam',
    bloodType: 'O-',
    contact: '01756789012',
    currentAddress: 'Flat 5C, Rose Garden, Mohammadpur, Dhaka',
    lastDonationDate: '2025-08-25',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '6',
    studentId: '2022-1-60-073',
    donorName: 'Sadia Akter',
    bloodType: 'A-',
    contact: '01867890123',
    currentAddress: 'House 78, Road 3, Bashundhara R/A, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '7',
    studentId: '2022-1-60-089',
    donorName: 'Tanvir Ahmed',
    bloodType: 'B-',
    contact: '01978901234',
    currentAddress: 'Flat 2A, Diamond Tower, Gulshan-1, Dhaka',
    lastDonationDate: '2025-11-30',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '8',
    studentId: '2022-1-60-101',
    donorName: 'Maliha Khan',
    bloodType: 'AB-',
    contact: '01689012345',
    currentAddress: 'House 34, Road 8, Banasree, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '9',
    studentId: '2022-1-60-118',
    donorName: 'Fahim Shahriar',
    bloodType: 'O+',
    contact: '01790123456',
    currentAddress: 'Flat 7D, Sky Garden, Motijheel, Dhaka',
    lastDonationDate: '2025-12-15',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '10',
    studentId: '2022-1-60-125',
    donorName: 'Ayesha Siddika',
    bloodType: 'A+',
    contact: '01801234567',
    currentAddress: 'House 56, Sector 12, Uttara, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '11',
    studentId: '2022-1-60-159',
    donorName: 'Sharmin Sultana',
    bloodType: 'A-',
    contact: '01734567892',
    currentAddress: 'Flat 6B, Pearl Residency, Mirpur-2, Dhaka',
    lastDonationDate: '2025-09-18',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '12',
    studentId: '2022-1-60-166',
    donorName: 'Rifat Mahmud',
    bloodType: 'AB+',
    contact: '01845678903',
    currentAddress: 'House 22, Road 4, Lalmatia, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    _id: '13',
    studentId: '2022-1-60-174',
    donorName: 'Sabrina Islam',
    bloodType: 'O-',
    contact: '01956789014',
    currentAddress: 'Flat 8A, Green City, Badda, Dhaka',
    lastDonationDate: '2025-11-20',
    isAvailable: true,
    status: 'Available',
  },
];

const BloodDonation = () => {
  const [donors, setDonors] = useState<BloodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodType, setSelectedBloodType] = useState('All');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  const bloodTypes = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.universityId || '2024510183';

  useEffect(() => {
    fetchDonors();
    // Load student's current info
    const savedAddress = localStorage.getItem('studentBloodDonorAddress');
    const savedAvailability = localStorage.getItem('studentBloodDonorAvailability');
    if (savedAddress) setCurrentAddress(savedAddress);
    if (savedAvailability !== null) setIsAvailable(savedAvailability === 'true');
  }, []);

  const handleUpdateProfile = () => {
    // Save to localStorage (in real app, would call API)
    localStorage.setItem('studentBloodDonorAddress', currentAddress);
    localStorage.setItem('studentBloodDonorAvailability', isAvailable.toString());
    
    setSaveMessage('Profile updated successfully!');
    setIsEditingProfile(false);
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/blood-donation'));
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setDonors(data);
        } else {
          // Fallback to mock data if API returns empty
          setDonors(mockDonors);
        }
      } else {
        // Fallback to mock data if API fails
        setDonors(mockDonors);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      // Fallback to mock data on error
      setDonors(mockDonors);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = selectedBloodType === 'All'
    ? donors.filter(donor => donor.isAvailable)
    : donors.filter(donor => donor.bloodType === selectedBloodType && donor.isAvailable);

  const availableDonors = filteredDonors.filter(d => d.status === 'Available' && d.isAvailable);

  return (
    <DashboardLayout title="Blood Donation">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HeartPulse className="text-red-600" size={28} />
            Blood Donation Registry
          </h1>
        </div>

        {/* Student Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Edit2 size={20} className="text-[#0C2B4E]" />
              My Donor Profile
            </h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-[#0C2B4E] text-white rounded-lg text-sm font-medium hover:bg-[#1A3D64] transition"
              >
                Update Profile
              </button>
            )}
          </div>

          {saveMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              {saveMessage}
            </div>
          )}

          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Current Address
                </label>
                <textarea
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  placeholder="Enter your current address"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="availability"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#0C2B4E] border-gray-300 rounded focus:ring-[#0C2B4E]"
                />
                <label htmlFor="availability" className="text-sm font-medium text-gray-700">
                  I am available for blood donation
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfile}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Student ID</p>
                <p className="text-sm font-medium text-gray-900">{studentId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentAddress || 'Not set - Click "Update Profile" to add your address'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Availability Status</p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Blood Type Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Blood Type
          </label>
          <div className="flex flex-wrap gap-2">
            {bloodTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBloodType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedBloodType === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Donors</p>
            <p className="text-3xl font-bold text-gray-900">{filteredDonors.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Available Donors</p>
            <p className="text-3xl font-bold text-green-600">{availableDonors.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Selected Type</p>
            <p className="text-3xl font-bold text-red-600">{selectedBloodType}</p>
          </div>
        </div>

        {/* Donors List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading donors...</p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Droplet className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No donors found for this blood type</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Donors</h2>
            <div className="space-y-3">
              {filteredDonors.map((donor) => (
                <div
                  key={donor._id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Droplet className="text-red-600" size={28} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{donor.donorName}</h3>
                        <p className="text-sm text-gray-600">ID: {donor.studentId}</p>
                        <p className="text-sm font-medium text-red-600">Blood Type: {donor.bloodType}</p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                    >
                      Available
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                      <p className="text-sm font-medium text-gray-900">{donor.contact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Address</p>
                      <p className="text-sm font-medium text-gray-900">{donor.currentAddress}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BloodDonation;
