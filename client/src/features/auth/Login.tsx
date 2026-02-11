import { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import authService from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.login(formData);
      const user = authService.getCurrentUser();
      
      // Redirect based on role
      if (user) {
        window.location.href = `/${user.role}`;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
         style={{
           backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920')"
         }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-darker/30 backdrop-blur-sm"></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-primary-darker mb-8">Login</h1>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-900 text-sm">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/ID Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <User size={20} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username / University ID"
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="group inline-flex items-center gap-3 text-white/90 cursor-pointer">
                <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${rememberMe ? 'bg-[#1D546C]' : 'bg-white/30'}`}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${rememberMe ? 'translate-x-5' : 'translate-x-1'}`} />
                </span>
                <span className="font-medium group-hover:text-white">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-white/90 font-medium px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark active:bg-primary-darker 
                       text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
