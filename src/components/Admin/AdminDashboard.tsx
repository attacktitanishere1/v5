import React, { useState } from 'react';
import { Users, MessageSquare, Shield, Flag, Settings, BarChart3, UserX, Ban, Crown, AlertTriangle, Plus, Send, Eye, EyeOff, Clock, Coins, Megaphone, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { users, messages, confessions, chatRooms, friendRequests, currentUser, userPreferences, notifications, createNewsPost, sendCreditsToUser, suspendRoom, hideRoom, banUser } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'update' as 'update' | 'poll' | 'announcement',
    pollOptions: ['', '', '', '']
  });
  const [creditTransfer, setCreditTransfer] = useState({
    username: '',
    amount: 0,
    reason: ''
  });

  // Mock admin check - in real app, check user role
  const isAdmin = currentUser?.id === '1'; // Mock admin check

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    onlineUsers: users.filter(u => u.isOnline).length,
    totalMessages: messages.length,
    totalConfessions: confessions.length,
    totalRooms: chatRooms.length,
    pendingReports: 5, // Mock data
    activeRooms: chatRooms.filter(r => !r.isSuspended).length,
    suspendedRooms: chatRooms.filter(r => r.isSuspended).length,
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: MessageSquare },
    { id: 'content', label: 'Content', icon: Shield },
    { id: 'news', label: 'News Manager', icon: Megaphone },
    { id: 'credits', label: 'Credits', icon: Coins },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    createNewsPost(newPost.title, newPost.content, newPost.type, 
      newPost.type === 'poll' ? newPost.pollOptions.filter(opt => opt.trim()) : undefined
    );
    
    setNewPost({
      title: '',
      content: '',
      type: 'update',
      pollOptions: ['', '', '', '']
    });
  };

  const handleSendCredits = () => {
    if (!creditTransfer.username.trim() || creditTransfer.amount <= 0) return;
    
    const success = sendCreditsToUser(creditTransfer.username, creditTransfer.amount, creditTransfer.reason);
    if (success) {
      setCreditTransfer({ username: '', amount: 0, reason: '' });
      alert('Credits sent successfully!');
    } else {
      alert('User not found!');
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="text-blue-500" size={32} />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">{stats.onlineUsers} online</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <MessageSquare className="text-green-500" size={32} />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalMessages}</p>
            <p className="text-sm text-gray-600">Total sent</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Shield className="text-purple-500" size={32} />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Confessions</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.totalConfessions}</p>
            <p className="text-sm text-gray-600">Published</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <MessageSquare className="text-orange-500" size={32} />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Chat Rooms</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.activeRooms}</p>
            <p className="text-sm text-gray-600">{stats.suspendedRooms} suspended</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Flag className="text-red-500" size={32} />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
            <p className="text-2xl font-bold text-red-600">{stats.pendingReports}</p>
            <p className="text-sm text-gray-600">Pending review</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isBlocked ? 'bg-red-100 text-red-800' :
                    user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isBlocked ? 'Banned' : user.isOnline ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    onClick={() => alert('Promote to admin')}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Promote to Admin"
                  >
                    <Crown size={16} />
                  </button>
                  <button 
                    onClick={() => banUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Ban User"
                  >
                    <Ban size={16} />
                  </button>
                  <button 
                    onClick={() => alert('Send message to user')}
                    className="text-blue-600 hover:text-blue-900"
                    title="Send Message"
                  >
                    <Send size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Room Management</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus size={16} />
          <span>Create Room</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chatRooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {room.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{room.name}</div>
                      <div className="text-sm text-gray-500">{room.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    room.isSuperSecret ? 'bg-purple-100 text-purple-800' :
                    room.isPrivate ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {room.isSuperSecret ? 'Super Secret' : room.isPrivate ? 'Private' : 'Public'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.memberCount} ({room.onlineCount} online)
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    room.isSuspended ? 'bg-red-100 text-red-800' :
                    room.isHidden ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {room.isSuspended ? 'Suspended' : room.isHidden ? 'Hidden' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    onClick={() => suspendRoom(room.id)}
                    className="text-orange-600 hover:text-orange-900"
                    title="Suspend Room"
                  >
                    <Clock size={16} />
                  </button>
                  <button 
                    onClick={() => hideRoom(room.id)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Hide/Show Room"
                  >
                    {room.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button 
                    onClick={() => alert('Delete room')}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Room"
                  >
                    <UserX size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNewsManager = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create News Post</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="update">Update</option>
              <option value="poll">Poll</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter post content"
            />
          </div>

          {newPost.type === 'poll' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poll Options</label>
              {newPost.pollOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newPost.pollOptions];
                    newOptions[index] = e.target.value;
                    setNewPost({ ...newPost, pollOptions: newOptions });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleCreatePost}
            disabled={!newPost.title.trim() || !newPost.content.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );

  const renderCreditsManager = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Credits to User</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={creditTransfer.username}
              onChange={(e) => setCreditTransfer({ ...creditTransfer, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={creditTransfer.amount}
              onChange={(e) => setCreditTransfer({ ...creditTransfer, amount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter credit amount"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <input
              type="text"
              value={creditTransfer.reason}
              onChange={(e) => setCreditTransfer({ ...creditTransfer, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Reason for credit transfer"
            />
          </div>

          <button
            onClick={handleSendCredits}
            disabled={!creditTransfer.username.trim() || creditTransfer.amount <= 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Send size={16} />
            <span>Send Credits</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {users.reduce((sum, user) => sum + user.credits, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Credits in System</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.round(users.reduce((sum, user) => sum + user.credits, 0) / users.length)}
            </p>
            <p className="text-sm text-gray-600">Average Credits per User</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.credits >= 1000).length}
            </p>
            <p className="text-sm text-gray-600">VIP Users (1000+ credits)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Pending Reports</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((report) => (
            <div key={report} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="text-red-500" size={16} />
                    <h4 className="font-medium text-gray-900">Inappropriate Content Report #{report}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">User reported for posting inappropriate content in General Chat</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Reported by: user_{report + 10}</span>
                    <span>2 hours ago</span>
                    <span>Type: Inappropriate Content</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Resolve & Reward
                  </button>
                  <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                    Investigate
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">General Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Allow New Registrations</label>
                <p className="text-sm text-gray-500">Control whether new users can register</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                <p className="text-sm text-gray-500">Put the app in maintenance mode</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-Credit Daily Login</label>
                <p className="text-sm text-gray-500">Automatically give users daily login credits</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Content Moderation</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-moderate Content</label>
                <p className="text-sm text-gray-500">Automatically flag inappropriate content</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
                <p className="text-sm text-gray-500">Users must verify email before posting</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Credit System</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Cost (Credits)</label>
              <input type="number" defaultValue="1" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Login Bonus</label>
              <input type="number" defaultValue="10" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral Bonus</label>
              <input type="number" defaultValue="250" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent_Tab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'rooms':
        return renderRooms();
      case 'content':
        return renderContent();
      case 'news':
        return renderNewsManager();
      case 'credits':
        return renderCreditsManager();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Confessions</h3>
        </div>
        <div className="p-6 space-y-4">
          {confessions.slice(0, 5).map((confession) => (
            <div key={confession.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{confession.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{confession.content.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>By: {confession.authorUsername}</span>
                    <span>{confession.likes} likes</span>
                    <span>{confession.comments.length} comments</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-green-600 hover:text-green-900">
                    <Shield size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Flag size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Complete control over your AnonChat application</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome back, Admin</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent_Tab()}
          </div>
        </div>
      </div>
    </div>
  );
}