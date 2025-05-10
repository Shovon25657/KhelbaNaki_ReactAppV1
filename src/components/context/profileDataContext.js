import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

//context
const ProfileDataContext = createContext();

const ProfileDataProvider = ({ children }) => {
  //state
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);

  //get posts
  const getProfileData = async () => {
    setLoading(true);
    try {
      // Get the auth data from AsyncStorage
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) {
        console.log('No auth data found');
        setLoading(false);
        return;
      }
      
      // Parse the auth data to get the token
      const { token } = JSON.parse(authData);
      
      // Make the request with the token in the Authorization header
      const { data } = await axios.get("/userabout/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setLoading(false);
      setProfileData(data?.profileData);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // initial posts
  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <ProfileDataContext.Provider value={[profileData, setProfileData, getProfileData]}>
      {children}
    </ProfileDataContext.Provider>
  );
};

export { ProfileDataContext, ProfileDataProvider };