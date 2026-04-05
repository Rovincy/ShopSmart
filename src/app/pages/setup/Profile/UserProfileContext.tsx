// src/context/UserProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  fullName: string;
  profilePictureUrl?: string;
}

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children, initialProfile }: { 
  children: ReactNode; 
  initialProfile: UserProfile 
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};