import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ChatRoom, RoomCategory, User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    username: 'current_user',
    email: 'user@example.com',
    credits: 150,
    joinDate: '2024-01-15',
    isOnline: true,
  },
];

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'General Chat',
    description: 'A place for general discussions',
    category: 'general',
    creatorId: '1',
    isPrivate: false,
    isSuperSecret: false,
    memberLimit: 100,
    memberCount: 25,
    onlineCount: 8,
    members: mockUsers,
    admins: ['1'],
    bannedUsers: [],
    favoritedBy: [],
    createdAt: '2024-01-15T10:00:00Z',
    lastActivity: '2024-01-20T15:30:00Z',
  },
];

interface RoomContextType {
  chatRooms: ChatRoom[];
  createRoom: (name: string, category: RoomCategory, isPrivate: boolean, isSuperSecret: boolean, password?: string, roomId?: string) => boolean;
  joinRoom: (roomId: string, password?: string) => boolean;
  joinSuperSecretRoom: (roomId: string, password: string) => boolean;
  kickUserFromRoom: (roomId: string, userId: string) => void;
  banUserFromRoom: (roomId: string, userId: string) => void;
  makeUserAdmin: (roomId: string, userId: string) => void;
  favoriteRoom: (roomId: string) => void;
  unfavoriteRoom: (roomId: string) => void;
  suspendRoom: (roomId: string) => void;
  hideRoom: (roomId: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(mockChatRooms);

  // Implementations are similar to the original AppContext, but simplified for demo
  const createRoom = useCallback((name: string, category: RoomCategory, isPrivate: boolean, isSuperSecret: boolean, password?: string, roomId?: string): boolean => {
    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name,
      description: '',
      category,
      creatorId: '1', // mock current user
      isPrivate,
      isSuperSecret,
      password,
      roomId: isSuperSecret ? (roomId || Math.random().toString(36).substring(2, 8).toUpperCase()) : undefined,
      memberLimit: 100,
      memberCount: 1,
      onlineCount: 1,
      members: mockUsers,
      admins: ['1'],
      bannedUsers: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    setChatRooms(prev => [...prev, newRoom]);
    return true;
  }, []);

  const joinRoom = useCallback((roomId: string, password?: string): boolean => true, []);
  const joinSuperSecretRoom = useCallback((roomId: string, password: string): boolean => true, []);
  const kickUserFromRoom = useCallback((roomId: string, userId: string) => {}, []);
  const banUserFromRoom = useCallback((roomId: string, userId: string) => {}, []);
  const makeUserAdmin = useCallback((roomId: string, userId: string) => {}, []);
  const favoriteRoom = useCallback((roomId: string) => {}, []);
  const unfavoriteRoom = useCallback((roomId: string) => {}, []);
  const suspendRoom = useCallback((roomId: string) => {}, []);
  const hideRoom = useCallback((roomId: string) => {}, []);

  const value = useMemo(() => ({
    chatRooms,
    createRoom,
    joinRoom,
    joinSuperSecretRoom,
    kickUserFromRoom,
    banUserFromRoom,
    makeUserAdmin,
    favoriteRoom,
    unfavoriteRoom,
    suspendRoom,
    hideRoom,
  }), [chatRooms, createRoom, joinRoom, joinSuperSecretRoom, kickUserFromRoom, banUserFromRoom, makeUserAdmin, favoriteRoom, unfavoriteRoom, suspendRoom, hideRoom]);

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}