import React from 'react';
import { AuthProvider } from './context/authContext';
import { ProfileDataProvider } from './context/profileDataContext';
import ScreenMenu from './Menus/ScreenMenu';

const RootNavigation = () => {
  return (
    <AuthProvider>
      <ProfileDataProvider>
        <ScreenMenu />
      </ProfileDataProvider>
    </AuthProvider>
  );
};

export default RootNavigation;