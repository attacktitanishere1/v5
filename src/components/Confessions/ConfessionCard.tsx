import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Confession } from '../../types';
import UserActionModal from './UserActionModal';

interface ConfessionCardProps {
  confession: Confession;
}

export const ConfessionCard: React.FC<ConfessionCardProps> = ({ confession }) => {
  const { user, likeConfession, saveConfession, savedConfessions } = useApp();
  const [showUserModal, setShowUserModal] = useState(false);
  
  const isLiked = confession.likes?.includes(user?.id || '');
  const isSaved = savedConfessions.some(saved => saved.id === confession.id);
  
  const handleLike = () => {
    if (user) {
      likeConfession(confession.id);
    }
  };
  
  const handleSave = () => {
    if (user) {
      saveConfession(confession);
    }
  };
  
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div>
              <p className="font-medium text-gray-900">Anonymous</p>
              <p className="text-sm text-gray-500">{formatTimeAgo(confession.timestamp)}</p>
            </div>
          </div>
          <button
            onClick={() => setShowUserModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {confession.content}
          </p>
          {confession.category && (
            <span className="inline-block mt-3 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
              {confession.category}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {confession.likes?.length || 0}
              </span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">
                {confession.comments?.length || 0}
              </span>
            </button>
          </div>
          
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-colors ${
              isSaved
                ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      {showUserModal && (
        <UserActionModal
          confession={confession}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </>
  );
};