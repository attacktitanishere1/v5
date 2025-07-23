import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Message } from '../types';

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hey! How are you doing?',
    type: 'text',
    timestamp: '2024-01-20T10:30:00Z',
    isRead: true,
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'I\'m doing great! Thanks for asking 😊',
    type: 'text',
    timestamp: '2024-01-20T10:32:00Z',
    isRead: true,
  },
];

interface ChatContextType {
  messages: Message[];
  sendMessage: (receiverId: string, content: string, type?: 'text' | 'image') => void;
  sendRoomMessage: (roomId: string, content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const sendMessage = useCallback((receiverId: string, content: string, type: 'text' | 'image' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // mock current user
      receiverId,
      content,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendRoomMessage = useCallback((roomId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // mock current user
      roomId,
      content,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const value = useMemo(() => ({
    messages,
    sendMessage,
    sendRoomMessage,
  }), [messages, sendMessage, sendRoomMessage]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}