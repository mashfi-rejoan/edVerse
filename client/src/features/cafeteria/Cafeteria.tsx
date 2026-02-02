import DashboardLayout from '../../components/DashboardLayout';
import { UtensilsCrossed } from 'lucide-react';

const Cafeteria = () => {
  return (
    <DashboardLayout title="Cafeteria">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-8 shadow-lg text-white">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Cafeteria</h1>
          </div>
          <p className="text-white/80 mt-2">Order food and manage your cafeteria balance</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md">
          <div className="text-center py-12">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-500">Cafeteria ordering system will be available soon</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cafeteria;
