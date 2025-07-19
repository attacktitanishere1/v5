import React, { useState } from 'react';
import { Users, MessageSquare, Shield, Flag, Settings, BarChart3, UserX, Ban, Crown, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { users, messages, confessions, chatRooms, friendRequests, currentUser, userPreferences } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

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
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Users className="text-orange-500" size={32} />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Chat Rooms</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.totalRooms}</p>
            <p className="text-sm text-gray-600">Active rooms</p>
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
                    user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isOnline ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-yellow-600 hover:text-yellow-900">
                    <Crown size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Ban size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
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
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Resolve
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
      case 'content':
        return renderContent();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your AnonChat application</p>
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