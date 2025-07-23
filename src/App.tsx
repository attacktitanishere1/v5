import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';
import PrivateChat from './components/Chat/PrivateChat';
import ChatRooms from './components/Rooms/ChatRooms';
import Confessions from './components/Confessions/Confessions';
import News from './components/News/News';
import Profile from './components/Profile/Profile';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import SettingsModal from './components/Profile/SettingsModal';
import AdminDashboard from './components/Admin/AdminDashboard';

function AppContent() {
  const { currentUser, userPreferences } = useApp();
  const [activeTab, setActiveTab] = useState('confessions');
  const [authMode, setAuthMode] = useState<'none' | 'login' | 'signup'>('none');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Apply font size and theme to document root
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${userPreferences.theme.fontSize}`);
    
    if (userPreferences.theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userPreferences.theme.fontSize, userPreferences.theme.isDark]);
  
  // Check if current URL is admin route
  const isAdminRoute = window.location.pathname === '/admin';
  
  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  // Show authentication pages
  if (authMode === 'login') {
    return (
      <LoginPage
        onSwitchToSignup={() => setAuthMode('signup')}
        onBack={() => setAuthMode('none')}
      />
    );
  }

  if (authMode === 'signup') {
    return (
      <SignupPage
        onSwitchToLogin={() => setAuthMode('login')}
        onBack={() => setAuthMode('none')}
      />
    );
  }

  // Redirect to login for protected routes
  if (!currentUser && activeTab !== 'confessions') {
    setAuthMode('login');
    return null;
  }

  const renderActiveTab = () => {
    if (showProfile) {
      return <Profile />;
    }
    
    switch (activeTab) {
      case 'private':
        return <PrivateChat />;
      case 'rooms':
        return <ChatRooms />;
      case 'confessions':
        return <Confessions />;
      case 'news':
        return <News />;
      default:
        return <Confessions />;
    }
  };

  const handleTabChange = (tab: string) => {
    if (!currentUser && tab !== 'confessions') {
      setAuthMode('login');
      return;
    }
    setActiveTab(tab);
    setShowProfile(false);
  };

  return (
    <div className={`h-screen flex flex-col ${
      userPreferences.theme.isDark ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-200`}>
      <Header 
        onProfileClick={() => setShowProfile(!showProfile)}
        onSettingsClick={() => setShowSettings(true)}
        onAuthClick={() => setAuthMode('login')}
      />
      <main className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </main>
      {currentUser && <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />}
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;