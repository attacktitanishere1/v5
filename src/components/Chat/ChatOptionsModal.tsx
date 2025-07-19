import React from 'react';
import { X, UserMinus, Ban, Info, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

interface ChatOptionsModalProps {
  user: User;
  onClose: () => void;
}

export default function ChatOptionsModal({ user, onClose }: ChatOptionsModalProps) {
  const { blockUser, deleteFriend, userPreferences } = useApp();

  const handleBlockUser = () => {
    if (window.confirm(`Are you sure you want to block ${user.username}? You won't receive messages from them.`)) {
      blockUser(user.id);
      onClose();
    }
  };

  const handleDeleteFriend = () => {
    if (window.confirm(`Are you sure you want to remove ${user.username} from your friends? This will delete your conversation history.`)) {
      deleteFriend(user.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-sm transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            Chat Options
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => alert('User info coming soon!')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
          >
            <Info size={20} />
            <span>View Contact Info</span>
          </button>

          <button
            onClick={handleBlockUser}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white transition-colors duration-200"
          >
            <Ban size={20} />
            <span>Block User</span>
          </button>

          <button
            onClick={handleDeleteFriend}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          >
            <Trash2 size={20} />
            <span>Delete Friend</span>
          </button>
        </div>
      </div>
    </div>
  );
}