import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Flag, Bookmark, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Confession } from '../../types';
import ReportModal from './ReportModal';

interface ConfessionCardProps {
  confession: Confession;
}

export default function ConfessionCard({ confession }: ConfessionCardProps) {
  const { likeConfession, saveConfession } = useApp();
  const [showReportModal, setShowReportModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const isLiked = confession.isLiked;
  const isSaved = confession.isSaved;

  const handleLike = () => {
    likeConfession(confession.id);
  };

  const handleSave = () => {
    saveConfession(confession.id);
  };

  const handleShare = () => {
    navigator.share?.({
      title: 'Anonymous Confession',
      text: confession.content,
      url: window.location.href
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const toggleAudioPlayback = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Anonymous</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimeAgo(confession.timestamp)} • {new Date(confession.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Flag className="w-5 h-5" />
        </button>
      </div>

      {confession.type === 'voice' ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAudioPlayback}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Confession</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">1:23</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
          {confession.content}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500 dark:text-gray-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{confession.likes || 0}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{confession.comments || 0}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 dark:text-gray-400 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`transition-colors ${
            isSaved 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          contentType="confession"
          contentId={confession.id}
          reportedUserId={confession.userId}
        />
      )}
    </div>
  );
}