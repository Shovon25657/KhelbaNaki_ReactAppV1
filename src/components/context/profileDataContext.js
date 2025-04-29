import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileDataContext = createContext();

const ProfileDataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const getProfileData = async () => {
    setLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) {
        console.log('No auth data found');
        setLoading(false);
        return;
      }
      
      const { token } = JSON.parse(authData);
      const { data } = await axios.get("/userabout/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProfileData(data?.profileData || {});
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <ProfileDataContext.Provider value={{
      profileData,
      setProfileData,
      getProfileData,
      loading
    }}>
      {children}
    </ProfileDataContext.Provider>
  );
};

export { ProfileDataContext, ProfileDataProvider };