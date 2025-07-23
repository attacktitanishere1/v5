import React from 'react';
import { Coins, Settings, User, Bell, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CreditsModal from '../Profile/CreditsModal';
import AuthModal from '../Auth/AuthModal';

interface HeaderProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAuthClick: () => void;
}

export default function Header({ onProfileClick, onSettingsClick, onAuthClick }: HeaderProps) {
  const { currentUser, userPreferences, updateCredits, notifications, updatePreferences } = useApp();
  const [showCreditsModal, setShowCreditsModal] = React.useState(false);
  
  // Apply font size to document root
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${userPreferences.theme.fontSize}`);
  }, [userPreferences.theme.fontSize]);
  
  const handleCreditsClick = () => {
    setShowCreditsModal(true);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === currentUser?.id);


  return (
    <header className={`${
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
        {currentUser && (
          <button
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
        )}
        
        {currentUser ? (
          <button
          onClick={handleCreditsClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Coins size={16} />
          <span>{currentUser.credits}</span>
          </button>
        ) : (
          <button
            onClick={onAuthClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          >
            Sign Up
          </button>
        )}
        
        {currentUser && (
          <button
          onClick={onProfileClick}
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
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
            </span>
          )}
          </button>
        )}
        
        {currentUser && (
          <button
          onClick={onSettingsClick}
          className={`p-2 rounded-full transition-colors duration-200 ${
            userPreferences.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <Settings 
            size={20} 
            className={`${
              userPreferences.theme.isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            } cursor-pointer transition-colors duration-200`}
          />
          </button>
        )}
      </div>
      
      {/* Credits Modal */}
      {showCreditsModal && currentUser && (
        <CreditsModal
          isOpen={showCreditsModal}
          onClose={() => setShowCreditsModal(false)}
        />
      )}
    </header>
  );
}