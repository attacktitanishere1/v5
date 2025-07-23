import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Flag, Bookmark, Play, Pause, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Confession } from '../../types';
import ReportModal from './ReportModal';

interface ConfessionCardProps {
  confession: Confession;
}

export default function ConfessionCard({ confession }: ConfessionCardProps) {
  const { likeConfession, saveConfession, shareConfession, userPreferences, currentUser, addComment } = useApp();
  const [showReportModal, setShowReportModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    likeConfession(confession.id);
  };

  const handleSave = () => {
    saveConfession(confession.id);
  };

  const handleShare = () => {
    shareConfession(confession.id);
  };

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

  const toggleAudioPlayback = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(confession.id, newComment.trim());
    setNewComment('');
  };

  const isAdmin = currentUser?.id === '1'; // Check if current user is admin

  return (
    <div className={`${
      userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-lg p-4 transition-colors duration-200`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
            confession.authorId === '1' ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-purple-400 to-pink-500'
          }`}>
            {confession.authorUsername.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`font-medium ${
                userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
              } ${confession.authorId === '1' ? 'text-red-500 animate-pulse' : ''}`}>
                {confession.authorId === '1' ? '🔥 Admin 🔥' : confession.authorUsername}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                confession.category === 'work' ? 'bg-blue-100 text-blue-800' :
                confession.category === 'family' ? 'bg-green-100 text-green-800' :
                confession.category === 'school' ? 'bg-purple-100 text-purple-800' :
                confession.category === 'relationships' ? 'bg-pink-100 text-pink-800' :
                confession.category === 'health' ? 'bg-red-100 text-red-800' :
                confession.category === 'entertainment' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {confession.category}
              </span>
            </div>
            <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTimeAgo(confession.timestamp)}
              {confession.isEdited && <span className="ml-2 text-xs">(edited)</span>}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className={`p-1 rounded-full ${
            userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors duration-200`}
        >
          <Flag size={16} className={userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h4 className={`font-bold text-lg mb-2 ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
          {confession.title}
        </h4>
        
        {confession.isVoice ? (
          <div className={`p-4 rounded-lg ${
            userPreferences.theme.isDark ? 'bg-gray-700' : 'bg-gray-100'
          } flex items-center space-x-3`}>
            <button
              onClick={toggleAudioPlayback}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Voice Confession
                </span>
                <span className={`text-xs ${
                  userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {confession.duration ? `${Math.floor(confession.duration / 60)}:${(confession.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${
                userPreferences.theme.isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <p className={`${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            {confession.content}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
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
          
          <button
            onClick={handleShare}
            className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${
              userPreferences.theme.isDark 
                ? 'text-gray-400 hover:text-green-400' 
                : 'text-gray-600 hover:text-green-500'
            }`}
          >
            <Share2 size={20} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
            confession.isSaved
              ? userPreferences.theme.isDark
                ? 'text-yellow-400 bg-yellow-900'
                : 'text-yellow-500 bg-yellow-50'
              : userPreferences.theme.isDark
              ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
              : 'text-gray-600 hover:text-yellow-500 hover:bg-gray-100'
          }`}
        >
          <Bookmark size={18} fill={confession.isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Comments Section */}
      {confession.comments.length > 0 && (
        <div className={`mt-4 pt-4 border-t ${userPreferences.theme.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setShowComments(!showComments)}
            className={`mb-3 text-sm font-medium ${
              userPreferences.theme.isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            } transition-colors duration-200`}
          >
            {showComments ? 'Hide' : 'Show'} {confession.comments.length} comment{confession.comments.length !== 1 ? 's' : ''}
          </button>
          
          {showComments && (
            <>
          <div className="space-y-3 mb-4">
            {confession.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  comment.authorId === '1' ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-blue-400 to-purple-500'
                }`}>
                  {comment.authorUsername.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      comment.authorId === '1' ? 'text-red-500 animate-pulse' : userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {comment.authorId === '1' ? '🔥 Admin 🔥' : comment.authorUsername}
                    </span>
                    <span className={`text-xs ${userPreferences.theme.isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Send size={16} />
            </button>
          </form>
            </>
          )}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          contentType="confession"
          contentId={confession.id}
          reportedUserId={confession.authorId}
        />
      )}
    </div>
  );
}