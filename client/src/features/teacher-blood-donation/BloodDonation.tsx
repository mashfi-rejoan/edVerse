import React, { useState, useEffect } from 'react';
import { Heart, Plus, Calendar, MapPin, Phone, AlertCircle, CheckCircle, Droplets } from 'lucide-react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';

const BloodDonationTeacher: React.FC = () => {
  const teacherBloodType = 'B+'; // Fixed teacher blood type
  const [donations, setDonations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-donations' | 'find-donors'>('my-donations');
  const [searchBloodType, setSearchBloodType] = useState<string>('');
  const [formData, setFormData] = useState({
    bloodType: teacherBloodType,
    donationDate: new Date().toISOString().split('T')[0],
    location: '',
    notes: ''
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const locations = [
    'Red Crescent Center',
    'City Hospital',
    'Medical College Hospital',
    'Community Health Center',
    'Blood Bank',
    'Other'
  ];

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('teacher_blood_donations');
    if (saved) {
      setDonations(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDonation = {
      _id: Date.now().toString(),
      ...formData,
      donatedAt: new Date().toISOString(),
      teacherName: 'Dr. Ahmed Khan',
      teacherId: 'TEACHER001'
    };

    const updated = [...donations, newDonation];
    setDonations(updated);
    localStorage.setItem('teacher_blood_donations', JSON.stringify(updated));

    // Reset form
    setFormData({
      bloodType: '',
      donationDate: new Date().toISOString().split('T')[0],
      location: '',
      notes: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = donations.filter(d => d._id !== id);
    setDonations(updated);
    localStorage.setItem('teacher_blood_donations', JSON.stringify(updated));
  };

  const getBloodTypeColor = (type: string) => {
    if (type.includes('+')) {
      return 'bg-red-500';
    }
    return 'bg-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateDaysSinceDonation = (dateString: string) => {
    const donationDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canDonateAgain = (lastDonation: any) => {
    const daysSince = calculateDaysSinceDonation(lastDonation.donationDate);
    return daysSince >= 56; // 56 days minimum between donations
  };

  // Mock blood donors data (from student pool)
  const mockBloodDonors = [
    { _id: '1', name: 'Karim Ahmed', bloodType: 'O+', phone: '+880 1700 123456', location: 'Dhaka', lastDonated: '2026-01-15' },
    { _id: '2', name: 'Fatima Islam', bloodType: 'B+', phone: '+880 1800 234567', location: 'Dhaka', lastDonated: '2026-02-01' },
    { _id: '3', name: 'Rajib Kumar', bloodType: 'A+', phone: '+880 1900 345678', location: 'Dhaka', lastDonated: '2025-12-20' },
    { _id: '4', name: 'Sarah Rahman', bloodType: 'O+', phone: '+880 1600 456789', location: 'Dhaka', lastDonated: '2026-01-28' },
    { _id: '5', name: 'Hassan Morshed', bloodType: 'AB+', phone: '+880 1700 567890', location: 'Dhaka', lastDonated: '2025-11-10' },
    { _id: '6', name: 'Nadia Sultana', bloodType: 'B-', phone: '+880 1800 678901', location: 'Dhaka', lastDonated: '2026-01-05' },
    { _id: '7', name: 'Imran Khan', bloodType: 'A-', phone: '+880 1900 789012', location: 'Dhaka', lastDonated: '2025-10-30' },
    { _id: '8', name: 'Sumi Das', bloodType: 'O-', phone: '+880 1600 890123', location: 'Dhaka', lastDonated: '2026-01-20' },
  ];

  const filteredDonors = searchBloodType 
    ? mockBloodDonors.filter(donor => donor.bloodType === searchBloodType)
    : mockBloodDonors;

  return (
    <TeacherDashboardLayout title="Blood Donation">
      <div className="space-y-6">
        {/* Header Panel */}
        <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heart size={40} className="text-red-300 flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold mb-1">Blood Donation</h1>
                <p className="text-blue-100">Track your blood donations and help save lives</p>
              </div>
            </div>
            {activeTab === 'my-donations' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition font-semibold whitespace-nowrap"
              >
                <Plus size={20} />
                Record Donation
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-donations')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'my-donations'
                ? 'text-[#0C2B4E] border-b-2 border-[#0C2B4E]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Donations
          </button>
          <button
            onClick={() => setActiveTab('find-donors')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'find-donors'
                ? 'text-[#0C2B4E] border-b-2 border-[#0C2B4E]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Find Blood Donors
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'my-donations' ? (
        <>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Donations</h3>
            <p className="text-4xl font-bold text-[#0C2B4E]">{donations.length}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Lives Helped</h3>
            <p className="text-4xl font-bold text-red-400">{donations.length * 3}</p>
            <p className="text-gray-600 text-xs mt-1">~3 people per donation</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Last Donation</h3>
            {donations.length > 0 ? (
              <p className="text-lg font-semibold text-gray-800">
                {calculateDaysSinceDonation(donations[donations.length - 1].donationDate)} days ago
              </p>
            ) : (
              <p className="text-gray-500">No donations yet</p>
            )}
          </div>
        </div>

        {/* Donation List */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Donation History</h2>

          {donations.length === 0 ? (
            <div className="text-center py-12">
              <Droplets size={48} className="mx-auto text-gray-400 mb-4 opacity-40" />
              <p className="text-gray-600 mb-4">No donations recorded yet</p>
              <p className="text-gray-500 text-sm">Click "Record Donation" to add your donation history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...donations].reverse().map((donation) => {
                const canDonate = canDonateAgain(donation);
                const daysSince = calculateDaysSinceDonation(donation.donationDate);
                const daysUntilEligible = 56 - daysSince;

                return (
                  <div
                    key={donation._id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition border-l-4 border-red-400"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`${getBloodTypeColor(donation.bloodType)} text-white px-3 py-1 rounded-full font-bold text-sm`}>
                            {donation.bloodType}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">{formatDate(donation.donationDate)}</h3>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin size={16} />
                          <span className="text-sm">{donation.location}</span>
                        </div>

                        {donation.notes && (
                          <p className="text-gray-700 text-sm italic">"{donation.notes}"</p>
                        )}
                      </div>

                      <div className="text-right">
                        {canDonate ? (
                          <div className="flex items-center gap-1 text-green-600 font-semibold text-sm mb-2">
                            <CheckCircle size={16} />
                            Eligible to donate
                          </div>
                        ) : (
                          <div className="text-amber-600 text-sm mb-2">
                            Eligible in {daysUntilEligible} days
                          </div>
                        )}

                        <button
                          onClick={() => handleDelete(donation._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Important Guidelines */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 mt-8">
          <div className="flex gap-3">
            <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-amber-900 font-bold mb-2">Blood Donation Guidelines</h3>
              <ul className="text-amber-800 text-sm space-y-1">
                <li>• Minimum interval between donations: 56 days (8 weeks)</li>
                <li>• Age requirement: 18-65 years</li>
                <li>• Minimum weight: 50 kg</li>
                <li>• Each donation can save up to 3 lives</li>
                <li>• Drink plenty of water before and after donation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Donation Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Record Blood Donation</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Type *
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                    {formData.bloodType}
                  </div>
                </div>

                {/* Donation Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Donation Date *
                  </label>
                  <input
                    type="date"
                    value={formData.donationDate}
                    onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Donation Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
                  >
                    Record Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
        ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Blood Donors</h2>
            <p className="text-sm text-gray-600">Select a blood type to find available donors</p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Blood Type</h3>
            <div className="grid grid-cols-4 gap-3">
              {bloodTypes.map((type) => {
                const isPositive = type.includes('+');
                const baseType = type.replace('+', '').replace('-', '');
                const rhFactor = isPositive ? 'Positive' : 'Negative';
                const isSelected = searchBloodType === type;

                return (
                  <button
                    key={type}
                    onClick={() => setSearchBloodType(isSelected ? '' : type)}
                    className={`relative rounded-lg p-4 transition-all ${
                      isSelected 
                        ? 'bg-red-600 ring-4 ring-red-200' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    <div className="text-white text-center">
                      <div className="text-3xl font-bold mb-1">{baseType}{isPositive ? '+' : '-'}</div>
                      <div className="text-xs font-medium opacity-90">Rh {rhFactor}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {searchBloodType && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing donors with blood type <span className="font-bold text-red-600">{searchBloodType}</span>
                </p>
                <button
                  onClick={() => setSearchBloodType('')}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDonors.map((donor) => (
              <div key={donor._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                        {donor.bloodType}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{donor.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Phone size={16} />
                      <span className="text-sm">{donor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm">{donor.location}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last donated: {formatDate(donor.lastDonated)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </TeacherDashboardLayout>
  );
};

export default BloodDonationTeacher;
