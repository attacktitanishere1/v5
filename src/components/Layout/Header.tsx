import React from 'react';
import { Coins, Settings, User, Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CreditsModal from '../Profile/CreditsModal';
import AuthModal from '../Auth/AuthModal';

interface HeaderProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAuthClick: () => void;
}

function ThemeToggle() {
  const { userPreferences, updatePreferences, currentUser } = useAuth();
  if (!currentUser) return null;
  return (
    <button
      aria-label={userPreferences.theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => updatePreferences({
        theme: { ...userPreferences.theme, isDark: !userPreferences.theme.isDark }
      })}
      className={`p-2 rounded-full transition-colors duration-200 ${
        userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
    >
      {userPreferences.theme.isDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-600" />
      )}
    </button>
  );
}

function CreditsButton({ onClick }: { onClick: () => void }) {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  return (
    <button
      aria-label="Show credits"
      onClick={onClick}
      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
    >
      <Coins size={16} />
      <span>{currentUser.credits}</span>
    </button>
  );
}

function ProfileButton({ onClick, unreadCount }: { onClick: () => void; unreadCount: number }) {
  const { userPreferences } = useAuth();
  return (
    <button
      aria-label="Open profile"
      onClick={onClick}
      className={`relative p-2 rounded-full transition-colors duration-200 ${
        userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
    >
      <User 
        size={20} 
        className={`${
          userPreferences.theme.isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        } transition-colors duration-200`}
      />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export default function Header({ onProfileClick, onSettingsClick, onAuthClick }: HeaderProps) {
  const { currentUser, userPreferences, notifications } = useAuth();
  const [showCreditsModal, setShowCreditsModal] = React.useState(false);

  // Memoize unread notifications for current user
  const unreadNotifications = React.useMemo(() =>
    notifications.filter(n => !n.isRead && n.userId === currentUser?.id),
    [notifications, currentUser]
  );

  return (
    <header role="banner" className={`${
      userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b px-4 py-3 flex items-center justify-between transition-colors duration-200`}>
      <div className="flex items-center space-x-3">
        <h1 className={`text-xl font-bold ${
          userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
        }`}>
          SecretHangout
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {currentUser ? (
          <CreditsButton onClick={() => setShowCreditsModal(true)} />
        ) : (
          <button
            aria-label="Sign up"
            onClick={onAuthClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          >
            Sign Up
          </button>
        )}
        {currentUser && (
          <ProfileButton onClick={onProfileClick} unreadCount={unreadNotifications.length} />
        )}
        {currentUser && (
          <button
            aria-label="Open settings"
            onClick={onSettingsClick}
            className={`p-2 rounded-full transition-colors duration-200 ${
              userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Settings size={20} className={userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        )}
      </div>
      {showCreditsModal && (
        <CreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
      )}
    </header>
  );
}