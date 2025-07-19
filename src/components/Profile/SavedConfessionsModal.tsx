import React from 'react';
import { X, Bookmark, Heart, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SavedConfessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedConfessionsModal({ isOpen, onClose }: SavedConfessionsModalProps) {
  const { confessions, userPreferences, likeConfession, saveConfession } = useApp();

  if (!isOpen) return null;

  const savedConfessions = confessions.filter(c => c.isSaved);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            Saved Confessions
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {savedConfessions.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark size={48} className={`mx-auto mb-4 ${userPreferences.theme.isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No saved confessions yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedConfessions.map((confession) => (
              <div
                key={confession.id}
                className={`${
                  userPreferences.theme.isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                } border rounded-lg p-4 transition-colors duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${'bg-gradient-to-r from-purple-400 to-pink-500'}`}>
                      {confession.authorUsername.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`font-medium ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                        {confession.authorUsername}
                      </h3>
                      <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTimeAgo(confession.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className={`font-bold text-lg mb-2 ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                    {confession.title}
                  </h4>
                  <p className={`${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {confession.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => likeConfession(confession.id)}
                      className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${
                        confession.isLiked 
                          ? 'text-red-500' 
                          : userPreferences.theme.isDark 
                          ? 'text-gray-400 hover:text-red-400' 
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart size={20} fill={confession.isLiked ? 'currentColor' : 'none'} />
                      <span className="text-sm font-medium">{confession.likes}</span>
                    </button>
                    
                    <div className={`flex items-center space-x-2 ${
                      userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <MessageSquare size={20} />
                      <span className="text-sm font-medium">{confession.comments.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => saveConfession(confession.id)}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                      confession.isSaved
                        ? userPreferences.theme.isDark
                          ? 'text-yellow-400 bg-yellow-900'
                          : 'text-yellow-500 bg-yellow-50'
                        : userPreferences.theme.isDark
                        ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-600'
                        : 'text-gray-600 hover:text-yellow-500 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark size={18} fill={confession.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}