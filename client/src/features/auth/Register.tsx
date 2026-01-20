import { useState } from 'react';
import { Eye, EyeOff, Lock, User, Mail, Phone, UserCircle } from 'lucide-react';
import authService from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityId: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    bloodGroup: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.universityId || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        universityId: formData.universityId,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup
      });
      
      setSuccess(true);
      setTimeout(() => {
        const user = authService.getCurrentUser();
        if (user) {
          window.location.href = `/${user.role}`;
        }
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('Registration error details:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920')"
           }}>
        <div className="absolute inset-0 bg-primary-darker/30 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-white/90">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative py-8"
         style={{
           backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920')"
         }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-darker/30 backdrop-blur-sm"></div>
      
      {/* Register Card */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-primary-darker mb-6">Register</h1>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-900 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <UserCircle size={20} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name *"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Email & University ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email *"
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                           text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleChange}
                  placeholder="University ID *"
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                           text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Phone & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                           text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Blood Group (for students) */}
            {formData.role === 'student' && (
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select Blood Group (Optional)</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            )}

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password *"
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password *"
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark active:bg-primary-darker 
                       text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg"
            >
              {loading ? 'REGISTERING...' : 'REGISTER'}
            </button>

            {/* Login Link */}
            <p className="text-center text-white text-sm mt-4">
              Already have an account?{' '}
              <a href="/login" className="font-semibold hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
