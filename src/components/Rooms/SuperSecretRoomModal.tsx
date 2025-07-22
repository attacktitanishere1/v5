import React, { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SuperSecretRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuperSecretRoomModal({ isOpen, onClose }: SuperSecretRoomModalProps) {
  const { currentUser, joinSuperSecretRoom, userPreferences } = useApp();
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [formData, setFormData] = useState({
    roomId: '',
    password: '',
    roomName: '',
    roomDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId.trim() || !formData.password.trim()) return;

    setIsLoading(true);
    setError('');
    
    const success = joinSuperSecretRoom(formData.roomId.trim().toUpperCase(), formData.password.trim());
    
    if (success) {
      onClose();
      setFormData({ roomId: '', password: '' });
    } else {
      setError('Invalid room ID or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-md transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold flex items-center space-x-2 ${
            userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Shield className="text-purple-500" size={24} />
            <span>Join Super Secret Room</span>
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'join'
                ? 'bg-purple-600 text-white'
                : userPreferences.theme.isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Join Room
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-purple-600 text-white'
                : userPreferences.theme.isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Create Room
          </button>
        </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Room ID *
            </label>
            <input
              type="text"
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value.toUpperCase() })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 ${
                userPreferences.theme.isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter room ID"
              required
              maxLength={8}
            />
          </div>

        {activeTab === 'join' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 ${
                userPreferences.theme.isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter room password"
              required
            />
          </div>

          {error && (
            <div className={`p-3 rounded-lg flex items-center space-x-2 ${
              userPreferences.theme.isDark ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-800'
            }`}>
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className={`p-3 rounded-lg ${
            userPreferences.theme.isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-800'
          }`}>
            <p className="text-sm">
              🔒 Super secret rooms are hidden from public view. You need the exact room ID and password to join.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.roomId.trim() || !formData.password.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Room Name *
              </label>
              <input
                type="text"
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter room name"
                required
                maxLength={50}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                value={formData.roomDescription}
                onChange={(e) => setFormData({ ...formData, roomDescription: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Describe your room (optional)"
                rows={3}
                maxLength={200}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Room Password *
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Set a password for your room"
                required
                maxLength={20}
              />
            </div>

            <div className={`p-3 rounded-lg ${
              userPreferences.theme.isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-800'
            }`}>
              <p className="text-sm">
                💰 Creating a super secret room costs 150 credits. Your current balance: {currentUser?.credits || 0} credits
              </p>
            </div>

            <button
              onClick={() => {
                // Handle create room logic here
                alert('Create super secret room functionality will be implemented');
              }}
              disabled={!formData.roomName.trim() || !formData.password.trim() || (currentUser?.credits || 0) < 150}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Create Super Secret Room (150 credits)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}