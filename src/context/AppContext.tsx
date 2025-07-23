// [CONTEXT SPLIT] This file now only provides AppProvider shell and legacy useAppContext. All state and logic have been moved to AuthContext, ChatContext, RoomContext, and ConfessionContext.
import React from 'react';
import { AuthProvider } from './AuthContext';

const AppContext = React.createContext(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Compose new providers here
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}

export function useAppContext() {
  return React.useContext(AppContext);
}