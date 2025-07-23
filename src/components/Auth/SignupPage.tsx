import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

export default function SignupPage({ onSwitchToLogin, onBack }: SignupPageProps) {
  const { register, userPreferences } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters long');
        setIsLoading(false);
        return;
      }

      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        onBack();
      } else {
        setError('Username or email already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className={`min-h-screen ${
      userPreferences.theme.isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
    } flex items-center justify-center p-4 transition-colors duration-200`}>
      <div className={`w-full max-w-md ${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl shadow-2xl p-8 transition-colors duration-200`}>
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className={`absolute top-4 left-4 p-2 rounded-full ${
              userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <ArrowLeft size={20} className={userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className={`text-3xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Join SecretHangout
          </h1>
          <p className={`${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Create your anonymous account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <div className="relative">
              <User size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Choose a username"
                required
                minLength={3}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <div className="relative">
              <Mail size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Create a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${userPreferences.theme.isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}