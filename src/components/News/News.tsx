import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, BarChart3, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  type: 'update' | 'poll' | 'announcement';
  authorId: string;
  timestamp: string;
  likes: number;
  comments: NewsComment[];
  isLiked: boolean;
  pollOptions?: PollOption[];
  hasVoted?: boolean;
}

interface NewsComment {
  id: string;
  authorId: string;
  authorUsername: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export default function News() {
  const { currentUser, userPreferences } = useApp();
  const [newsPosts] = useState<NewsPost[]>([
    {
      id: '1',
      title: 'Upcoming Features - What do you want to see?',
      content: 'We\'re planning exciting new features for AnonChat! Tell us what you\'d like to see next.',
      type: 'poll',
      authorId: 'admin',
      timestamp: '2024-01-20T10:00:00Z',
      likes: 25,
      comments: [
        {
          id: '1',
          authorId: '2',
          authorUsername: 'friend_user_1',
          content: 'I\'d love to see video calls!',
          timestamp: '2024-01-20T10:30:00Z',
          likes: 5,
          isLiked: false,
        }
      ],
      isLiked: false,
      pollOptions: [
        { id: '1', text: 'Video Calls', votes: 45, voters: [] },
        { id: '2', text: 'File Sharing', votes: 32, voters: [] },
        { id: '3', text: 'Group Video Chat', votes: 28, voters: [] },
        { id: '4', text: 'Custom Themes', votes: 19, voters: [] },
      ],
      hasVoted: false,
    },
    {
      id: '2',
      title: 'New Voice Confessions Feature!',
      content: 'You can now share voice confessions up to 1 minute 30 seconds! Express yourself in a whole new way.',
      type: 'update',
      authorId: 'admin',
      timestamp: '2024-01-19T15:00:00Z',
      likes: 67,
      comments: [],
      isLiked: true,
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll':
        return <BarChart3 size={20} className="text-blue-500" />;
      case 'update':
        return <Calendar size={20} className="text-green-500" />;
      default:
        return <MessageSquare size={20} className="text-purple-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'poll':
        return 'Poll';
      case 'update':
        return 'Update';
      default:
        return 'Announcement';
    }
  };

  return (
    <div className={`h-full ${userPreferences.theme.isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`${userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
        <h2 className={`text-xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
          News & Updates
        </h2>
        <p className={`text-sm mt-1 ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Stay updated with the latest features and community polls
        </p>
      </div>

      {/* News Posts */}
      <div className="overflow-y-auto h-full pb-20">
        <div className="space-y-4 p-4">
          {newsPosts.map((post) => (
            <div
              key={post.id}
              className={`${
                userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border rounded-lg p-4 transition-colors duration-200`}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                        🔥 Admin 🔥
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        post.type === 'poll' ? 'bg-blue-100 text-blue-800' :
                        post.type === 'update' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {getTypeIcon(post.type)}
                        <span>{getTypeLabel(post.type)}</span>
                      </span>
                    </div>
                    <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatTimeAgo(post.timestamp)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h4 className={`font-bold text-lg mb-2 ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h4>
                <p className={`${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  {post.content}
                </p>
              </div>

              {/* Poll Options */}
              {post.type === 'poll' && post.pollOptions && (
                <div className="mb-4 space-y-2">
                  {post.pollOptions.map((option) => {
                    const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 0;
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    
                    return (
                      <button
                        key={option.id}
                        className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                          userPreferences.theme.isDark 
                            ? 'border-gray-600 hover:border-blue-500 bg-gray-700' 
                            : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                            {option.text}
                          </span>
                          <span className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {option.votes} votes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className={`mt-2 h-2 rounded-full ${userPreferences.theme.isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div 
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className={`flex items-center space-x-2 transition-colors duration-200 ${
                    post.isLiked 
                      ? 'text-red-500' 
                      : userPreferences.theme.isDark 
                      ? 'text-gray-400 hover:text-red-400' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}>
                    <ThumbsUp size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${
                      userPreferences.theme.isDark 
                        ? 'text-gray-400 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-500'
                    }`}
                  >
                    <MessageSquare size={20} />
                    <span className="text-sm font-medium">{post.comments.length}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className={`mt-4 pt-4 border-t ${userPreferences.theme.isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="space-y-3 mb-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                          {comment.authorUsername.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                              {comment.authorUsername}
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

                  <div className="flex space-x-3">
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
                      disabled={!newComment.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}