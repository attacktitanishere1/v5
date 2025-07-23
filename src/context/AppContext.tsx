// [CONTEXT SPLIT] This file now only provides AppProvider shell and legacy useAppContext. All state and logic have been moved to AuthContext, ChatContext, RoomContext, and ConfessionContext.
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ChatProvider } from './ChatContext';
import { RoomProvider } from './RoomContext';
import { ConfessionProvider } from './ConfessionContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <RoomProvider>
          <ConfessionProvider>
            {children}
          </ConfessionProvider>
        </RoomProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export function useAppContext() {
  return React.useContext(React.createContext(undefined));
}