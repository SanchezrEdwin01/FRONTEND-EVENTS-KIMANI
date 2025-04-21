import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  return (
    <UserContext.Provider value={{ user, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
