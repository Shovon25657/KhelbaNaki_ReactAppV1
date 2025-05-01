import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileDataContext = createContext();

const ProfileDataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const getProfileData = async () => {
    setLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      const { data } = await axios.get("/userabout/get-profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.success) {
        setProfileData(data.profileData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <ProfileDataContext.Provider value={{
      profileData,
      setProfileData, // Now properly exposed
      loading,
      error,
      getProfileData
    }}>
      {children}
    </ProfileDataContext.Provider>
  );
};

export { ProfileDataContext, ProfileDataProvider };