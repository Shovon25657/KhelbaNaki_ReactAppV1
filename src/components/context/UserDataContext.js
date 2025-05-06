import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userLookingForData, setUserLookingForData] = useState(null);
  const [userGamesPlayedData, setUserGamesPlayedData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all user data
  const getUserData = async () => {
    setLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      
      // Fetch both endpoints in parallel
      const [profileDataRes, aboutRes, userProfileRes, userLookingForRes, userGamesPlayedRes ] = await Promise.all([
        axios.get("/userabout/get-profile-data", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/userabout/get-about-data", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/userabout/get-user-profile", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/userabout/get-user-looking-for-data", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/userabout/get-user-gamesplayed-data", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (profileDataRes.data?.success) setUserProfileData(profileDataRes.data.userProfileData);
      if (aboutRes.data?.success) setAboutData(aboutRes.data.aboutData);
      if (userProfileRes.data?.success) setUserProfile(userProfileRes.data.userProfile);
      if (userLookingForRes.data?.success) {
        console.log("Setting user looking for data:", userLookingForRes.data.userLookingForData); // Add this line
      setUserLookingForData(userLookingForRes.data.userLookingForData);
      }

        setUserLookingForData(userLookingForRes.data.userLookingForData);
    if (userGamesPlayedRes.data?.success) {
      console.log("Full games played response:", userGamesPlayedRes.data.gamesPlayed);
            setUserGamesPlayedData(userGamesPlayedRes.data.gamesPlayed);
    }
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
      userProfileData,
      setUserProfileData,
      
      // About data
      aboutData,
      setAboutData,

      // // User looking for data
       userLookingForData,
       setUserLookingForData,

      // User profile
      userProfile,
      setUserProfile,

      // User games played data
      userGamesPlayedData,
      setUserGamesPlayedData,
      
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