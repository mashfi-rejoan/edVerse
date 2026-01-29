import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { HeartPulse, Droplet } from 'lucide-react';

interface BloodDonation {
  _id: string;
  donorName: string;
  bloodType: string;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  status: string;
}

const BloodDonation = () => {
  const [donors, setDonors] = useState<BloodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodType, setSelectedBloodType] = useState('All');

  const bloodTypes = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/blood-donation');
      if (response.ok) {
        const data = await response.json();
        setDonors(data);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = selectedBloodType === 'All'
    ? donors
    : donors.filter(donor => donor.bloodType === selectedBloodType);

  const availableDonors = filteredDonors.filter(d => d.status === 'Available');

  return (
    <DashboardLayout title="Blood Donation">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HeartPulse className="text-red-600" size={28} />
            Blood Donation Registry
          </h1>
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
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Droplet className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{donor.donorName}</h3>
                      <p className="text-sm text-gray-600">Blood Type: {donor.bloodType}</p>
                      {donor.lastDonationDate && (
                        <p className="text-xs text-gray-500">
                          Last donated: {new Date(donor.lastDonationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      donor.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {donor.status}
                  </span>
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
