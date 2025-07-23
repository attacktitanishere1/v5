import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useApp();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (showUsernameStep) {
          success = await register(formData.username, formData.email, formData.password);
        } else {
          setShowUsernameStep(true);
          setIsLoading(false);
          return;
        }
      }
      
      if (success) {
        onClose();
        setFormData({ username: '', email: '', password: '' });
        setShowUsernameStep(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex">
          {/* Left side - Features showcase */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 p-8 flex-col justify-center text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Welcome to AnonChat</h1>
              <p className="text-xl opacity-90">Share your thoughts anonymously and connect with others safely</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Anonymous Confessions</h3>
                  <p className="opacity-80">Share your deepest thoughts without judgment</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Chat Rooms</h3>
                  <p className="opacity-80">Join conversations on topics you care about</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Private Messages</h3>
                  <p className="opacity-80">Connect privately with friends you make</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Safe & Secure</h3>
                  <p className="opacity-80">Your privacy and safety are our top priority</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="text-yellow-300" size={20} />
                <span className="font-semibold">Join 10,000+ users</span>
              </div>
              <p className="text-sm opacity-80">Experience authentic conversations in a judgment-free environment</p>
            </div>
          </div>
          
          {/* Right side - Auth form */}
          <div className="w-full lg:w-1/2 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : showUsernameStep ? 'Create Your Identity' : 'Join AnonChat'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!isLogin && showUsernameStep ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="text-yellow-600" size={20} />
                <h3 className="font-semibold text-yellow-800">Privacy & Safety Guidelines</h3>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Choose a username that doesn't reveal your real identity</li>
                <li>• Never share personal information like your real name, address, or phone</li>
                <li>• Keep your conversations anonymous and safe</li>
                <li>• Report any inappropriate behavior immediately</li>
              </ul>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose Your Anonymous Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  required
                  placeholder="Enter a unique username"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">This will be your identity in AnonChat. Choose wisely!</p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !formData.username.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-lg"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowUsernameStep(false)}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                ← Back
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="text-purple-600" size={20} />
                  <h3 className="font-semibold text-purple-800">Get Started</h3>
                </div>
                <p className="text-sm text-purple-700">Join thousands of users sharing authentic stories anonymously</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-lg"
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Continue')}
            </button>
          </form>
        )}

        {(!showUsernameStep || isLogin) && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowUsernameStep(false);
                }}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}

        {!isLogin && !showUsernameStep && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="text-green-600" size={16} />
              <span className="font-semibold text-green-800">Welcome Bonus</span>
            </div>
            <p className="text-sm text-green-700">
              🎉 Get 100 free credits when you sign up! Use them to send messages and create rooms.
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
  );
}