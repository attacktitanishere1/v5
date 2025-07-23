import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Confession, ConfessionComment } from '../types';

const mockConfessions: Confession[] = [
  {
    id: '1',
    title: 'Work Stress',
    content: 'I\'ve been feeling overwhelmed at work lately...',
    category: 'work',
    authorId: '2',
    authorUsername: 'friend_user_1',
    timestamp: '2024-01-20T14:30:00Z',
    likes: 5,
    comments: [],
    isLiked: false,
    isSaved: false,
    isEdited: false,
  },
];

interface ConfessionContextType {
  confessions: Confession[];
  createConfession: (title: string, content: string, category: string) => void;
  editConfession: (confessionId: string, title: string, content: string) => void;
  deleteConfession: (confessionId: string) => void;
  likeConfession: (confessionId: string) => void;
  saveConfession: (confessionId: string) => void;
  addComment: (confessionId: string, content: string) => void;
  likeComment: (confessionId: string, commentId: string) => void;
  addFriendByUsername: (username: string) => boolean;
  createVoiceConfession: (title: string, category: string, audioBlob: Blob, duration: number) => void;
  shareConfession: (confessionId: string) => string;
}

const ConfessionContext = createContext<ConfessionContextType | undefined>(undefined);

export function ConfessionProvider({ children }: { children: React.ReactNode }) {
  const [confessions, setConfessions] = useState<Confession[]>(mockConfessions);

  const createConfession = useCallback((title: string, content: string, category: string) => {}, []);
  const editConfession = useCallback((confessionId: string, title: string, content: string) => {}, []);
  const deleteConfession = useCallback((confessionId: string) => {}, []);
  const likeConfession = useCallback((confessionId: string) => {}, []);
  const saveConfession = useCallback((confessionId: string) => {}, []);
  const addComment = useCallback((confessionId: string, content: string) => {}, []);
  const likeComment = useCallback((confessionId: string, commentId: string) => {}, []);
  const addFriendByUsername = useCallback((username: string) => false, []);
  const createVoiceConfession = useCallback((title: string, category: string, audioBlob: Blob, duration: number) => {}, []);
  const shareConfession = useCallback((confessionId: string) => '', []);

  const value = useMemo(() => ({
    confessions,
    createConfession,
    editConfession,
    deleteConfession,
    likeConfession,
    saveConfession,
    addComment,
    likeComment,
    addFriendByUsername,
    createVoiceConfession,
    shareConfession,
  }), [confessions, createConfession, editConfession, deleteConfession, likeConfession, saveConfession, addComment, likeComment, addFriendByUsername, createVoiceConfession, shareConfession]);

  return <ConfessionContext.Provider value={value}>{children}</ConfessionContext.Provider>;
}

export function useConfession() {
  const context = useContext(ConfessionContext);
  if (context === undefined) {
    throw new Error('useConfession must be used within a ConfessionProvider');
  }
  return context;
}