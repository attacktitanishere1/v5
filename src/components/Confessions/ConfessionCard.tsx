import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, MoreHorizontal, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Confession } from '../../types';
import UserActionModal from './UserActionModal';

interface ConfessionCardProps {
  confession: Confession;
}

export const ConfessionCard: React.FC<ConfessionCardProps> = ({ confession }) => {
  const { currentUser, likeConfession, saveConfession, userPreferences } = useApp();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
    
    return date.toLocaleDateString();
  };

  const getCategoryEmoji = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      work: '💼',
      family: '👨‍👩‍👧‍👦',
      school: '🎓',
      relationships: '💕',
      health: '🏥',
      entertainment: '🎉',
      other: '🤔'
    };
    return categoryMap[category] || '🤔';
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    // This would call addComment from context
    // addComment(confession.id, newComment.trim());
    setNewComment('');
  };

  const toggleAudio = () => {
    if (confession.isVoice && confession.audioUrl) {
      // Handle audio playback
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-lg p-4 transition-colors duration-200`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              confession.authorId === currentUser?.id 
                ? 'bg-gradient-to-r from-blue-400 to-purple-500'
                : 'bg-gradient-to-r from-purple-400 to-pink-500'
            }`}>
              {confession.authorUsername.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUserModal(true)}
                  className={`font-medium hover:underline ${
                    userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {confession.authorUsername}
                </button>
                <span className="text-lg">{getCategoryEmoji(confession.category)}</span>
              </div>
              <p className={`text-sm ${
                userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formatTimeAgo(confession.timestamp)}
                {confession.isEdited && ' • edited'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUserModal(true)}
            className={`p-1 rounded-full ${
              userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <MoreHorizontal size={16} className={
              userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
            } />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h4 className={`font-bold text-lg mb-2 ${
            userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {confession.title}
          </h4>
          
          {confession.isVoice ? (
            <div className={`p-4 rounded-lg ${
              userPreferences.theme.isDark ? 'bg-gray-700' : 'bg-gray-100'
            } flex items-center space-x-3`}>
              <button
                onClick={toggleAudio}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors duration-200"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div>
                <p className={`font-medium ${
                  userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Voice Confession
                </p>
                <p className={`text-sm ${
                  userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {confession.duration ? `${Math.floor(confession.duration / 60)}:${(confession.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                </p>
              </div>
            </div>
          ) : (
            <p className={`${
              userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
            } leading-relaxed whitespace-pre-wrap`}>
              {confession.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => currentUser && likeConfession(confession.id)}
              disabled={!currentUser}
              className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${
                confession.isLiked 
                  ? 'text-red-500' 
                  : userPreferences.theme.isDark 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-600 hover:text-red-500'
              } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart size={20} fill={confession.isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{confession.likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                userPreferences.theme.isDark 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <MessageSquare size={20} />
              <span className="text-sm font-medium">{confession.comments.length}</span>
            </button>
          </div>

          <button
            onClick={() => currentUser && saveConfession(confession.id)}
            disabled={!currentUser}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
              confession.isSaved
                ? userPreferences.theme.isDark
                  ? 'text-yellow-400 bg-yellow-900'
                  : 'text-yellow-500 bg-yellow-50'
                : userPreferences.theme.isDark
                ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                : 'text-gray-600 hover:text-yellow-500 hover:bg-gray-100'
            } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Bookmark size={18} fill={confession.isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className={`mt-4 pt-4 border-t ${
            userPreferences.theme.isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="space-y-3 mb-4">
              {confession.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                    {comment.authorUsername.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {comment.authorUsername}
                      </span>
                      <span className={`text-xs ${
                        userPreferences.theme.isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {currentUser && (
              <form onSubmit={handleAddComment} className="flex space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    userPreferences.theme.isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Post
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* User Action Modal */}
      {showUserModal && (
        <UserActionModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          username={confession.authorUsername}
          userId={confession.authorId}
        />
      )}
    </>
  );
};