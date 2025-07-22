import React, { useState } from 'react';
import { Search, UserPlus, User, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSearch({ isOpen, onClose }: UserSearchProps) {
  const { users, currentUser, sendFriendRequest, userPreferences } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof users>([]);

  if (!isOpen || !currentUser) return null;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim().length >= 2) {
      const results = users.filter(user => 
        user.id !== currentUser.id &&
        user.username.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 10); // Limit to 10 results
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const getCreditStatus = (credits: number) => {
    if (credits >= 2000) return { label: 'Legendary', color: 'from-purple-400 to-pink-500', badge: '👑' };
    if (credits >= 1000) return { label: 'VIP Elite', color: 'from-yellow-400 to-orange-500', badge: '🔥' };
    if (credits >= 500) return { label: 'VIP Gold', color: 'from-yellow-400 to-yellow-600', badge: '⭐' };
    if (credits >= 200) return { label: 'Active User', color: 'from-blue-400 to-purple-500', badge: '💎' };
    return { label: 'New User', color: 'from-green-400 to-blue-500', badge: '🌱' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            Search Users
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'
          }`} size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              userPreferences.theme.isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          {searchTerm.length < 2 && (
            <div className="text-center py-8">
              <Search size={48} className={`mx-auto mb-4 ${userPreferences.theme.isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Type at least 2 characters to search
              </p>
            </div>
          )}

          {searchTerm.length >= 2 && searchResults.length === 0 && (
            <div className="text-center py-8">
              <User size={48} className={`mx-auto mb-4 ${userPreferences.theme.isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No users found matching "{searchTerm}"
              </p>
            </div>
          )}

          {searchResults.map((user) => {
            const creditStatus = getCreditStatus(user.credits);
            return (
              <div
                key={user.id}
                className={`p-4 rounded-lg border transition-colors duration-200 ${
                  userPreferences.theme.isDark 
                    ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r ${creditStatus.color} ${
                      user.credits >= 1000 ? 'animate-pulse' : ''
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${
                          userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                        } ${user.credits >= 2000 ? 'animate-pulse' : ''}`}>
                          {user.username}
                        </h3>
                        <span className="text-lg">{creditStatus.badge}</span>
                        {user.credits >= 2000 && (
                          <Crown size={16} className="text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {creditStatus.label}
                        </p>
                        <span className={`w-2 h-2 rounded-full ${
                          user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className={`text-xs ${userPreferences.theme.isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      sendFriendRequest(user.id);
                      onClose();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200"
                    title="Send Friend Request"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}