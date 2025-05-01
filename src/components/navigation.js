import React from 'react';
import { AuthProvider } from './context/authContext';
import { UserDataProvider } from './context/UserDataContext';

import ScreenMenu from './Menus/ScreenMenu';

const RootNavigation = () => {
  return (
    <AuthProvider>
      <UserDataProvider>
        <ScreenMenu />
      </UserDataProvider>
    </AuthProvider>
  );
};

export default RootNavigation;