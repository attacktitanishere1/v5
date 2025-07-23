import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onBack: () => void;
}

export default function LoginPage({ onSwitchToSignup, onBack }: LoginPageProps) {
  const { login, userPreferences } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        onBack();
      } else {
        setError('Invalid username or password');
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
      userPreferences.theme.isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-blue-50'
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
          
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className={`text-3xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome Back
          </h1>
          <p className={`${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to SecretHangout
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
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your username"
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
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
                required
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}