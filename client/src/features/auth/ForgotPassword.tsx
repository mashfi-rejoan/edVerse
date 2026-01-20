import { useState } from 'react';
import { Mail } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
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
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
            <div className="text-center">
              <div className="text-green-400 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
              <p className="text-white/90 mb-6">
                We&apos;ve sent password reset instructions to <strong>{email}</strong>
              </p>
              <a
                href="/login"
                className="inline-block px-6 py-3 rounded-full bg-primary hover:bg-primary-dark 
                         text-white font-semibold transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
         style={{
           backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920')"
         }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-darker/30 backdrop-blur-sm"></div>
      
      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-primary-darker mb-3">Forgot Password?</h1>
          <p className="text-center text-white/90 mb-8 text-sm">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-900 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 
                         text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark active:bg-primary-darker 
                       text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg"
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            {/* Back to Login */}
            <p className="text-center text-white text-sm mt-6">
              Remember your password?{' '}
              <a href="/login" className="font-semibold hover:underline">
                Back to Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
