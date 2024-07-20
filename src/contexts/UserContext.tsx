import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchProfile } from '../api';

interface UserContextProps {
  username: string | null;
  setUsername: (username: string | null) => void;
  fetchUserProfile: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetchProfile();
      setUsername(response.data.username);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
