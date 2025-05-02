import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all user data
  const getUserData = async () => {
    setLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      
      // Fetch both endpoints in parallel
      const [profileRes, aboutRes] = await Promise.all([
        axios.get("/userabout/get-profile", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/userabout/get-about", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (profileRes.data?.success) setProfileData(profileRes.data.profileData);
      if (aboutRes.data?.success) setAboutData(aboutRes.data.aboutData);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{
      // Profile data
      profileData,
      setProfileData,
      
      // About data
      aboutData,
      setAboutData,
      
      // Common states
      loading,
      error,
      refreshData: getUserData
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };