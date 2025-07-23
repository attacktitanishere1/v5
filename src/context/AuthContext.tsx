import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { User, UserPreferences, Notification } from '../types';

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'current_user',
    email: 'user@example.com',
    credits: 150,
    joinDate: '2024-01-15',
    isOnline: true,
  },
  {
    id: '2',
    username: 'friend_user_1',
    email: 'friend1@example.com',
    credits: 75,
    joinDate: '2024-01-10',
    isOnline: true,
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'friend_request',
    title: 'New Friend Request',
    content: 'You have a new friend request from friend_user_1.',
    timestamp: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 'n2',
    userId: '1',
    type: 'message',
    title: 'New Message',
    content: 'You received a new message.',
    timestamp: new Date().toISOString(),
    isRead: false,
  },
];

interface AuthContextType {
  currentUser: User | null;
  userPreferences: UserPreferences;
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateCredits: (amount: number) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: {
      isDark: false,
      fontSize: 'medium',
      language: 'en',
    },
    notifications: {
      messages: true,
      friendRequests: true,
      confessions: true,
      admin: true,
    },
    privacy: {
      showOnlineStatus: true,
      allowFriendRequests: true,
    },
  });
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      credits: 100,
      joinDate: new Date().toISOString(),
      isOnline: true,
    };
    setCurrentUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
  }, []);

  const updateCredits = useCallback((amount: number) => {
    setCurrentUser(prev => prev ? { ...prev, credits: Math.max(0, prev.credits + amount) } : null);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, isRead: true } : notif));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  }, []);

  const value = useMemo(() => ({
    currentUser,
    userPreferences,
    notifications,
    login,
    register,
    logout,
    updatePreferences,
    updateCredits,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  }), [currentUser, userPreferences, notifications, login, register, logout, updatePreferences, updateCredits, markNotificationAsRead, markAllNotificationsAsRead]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}