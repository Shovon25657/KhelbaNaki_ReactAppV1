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
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [allUsersError, setAllUsersError] = useState(null);
  const [error, setError] = useState(null);
  

  // Fetch current user data
  const getUserData = async () => {
    setLoading(true);
    setError(null); // Reset error state before new request
    
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) {
        console.log('No auth data found in AsyncStorage');
        setLoading(false);
        return;
      }
      
      const { token } = JSON.parse(authData);
      if (!token) {
        console.log('No token found in auth data');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        // Fetch profile data
        const profileDataRes = await axios.get("/userabout/get-profile-data", { headers });
        console.log('Profile data response:', profileDataRes.data);
        if (profileDataRes.data?.success) {
          setUserProfileData(profileDataRes.data.userProfileData);
        } else {
          console.log('Profile data fetch unsuccessful:', profileDataRes.data);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
      
      try {
        // Fetch about data
        const aboutRes = await axios.get("/userabout/get-about-data", { headers });
        console.log('About data response:', aboutRes.data);
        if (aboutRes.data?.success) {
          setAboutData(aboutRes.data.aboutData);
        } else {
          console.log('About data fetch unsuccessful:', aboutRes.data);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      }
      
      try {
        // Fetch user profile
        const userProfileRes = await axios.get("/userabout/get-profile-data", { headers });
        console.log('User profile response:', userProfileRes.data);
        if (userProfileRes.data?.success) {
          setUserProfile(userProfileRes.data.userProfile);
        } else {
          console.log('User profile fetch unsuccessful:', userProfileRes.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
      
      try {
        // Fetch looking for data
        const userLookingForRes = await axios.get("/userabout/get-user-looking-for-data", { headers });
        console.log('Looking for data response:', userLookingForRes.data);
        if (userLookingForRes.data?.success) {
          setUserLookingForData(userLookingForRes.data.userLookingForData);
        } else {
          console.log('Looking for data fetch unsuccessful:', userLookingForRes.data);
        }
      } catch (err) {
        console.error('Error fetching looking for data:', err);
      }
      
      try {
        // Fetch games played data
        const userGamesPlayedRes = await axios.get("/userabout/get-user-gamesplayed-data", { headers });
        console.log('Games played data response:', userGamesPlayedRes.data);
        if (userGamesPlayedRes.data?.success) {
          setUserGamesPlayedData(userGamesPlayedRes.data.gamesPlayed);
        } else {
          console.log('Games played data fetch unsuccessful:', userGamesPlayedRes.data);
        }
      } catch (err) {
        console.error('Error fetching games played data:', err);
      }
      
    } catch (error) {
      console.error('Main error in getUserData:', error);
      setError(error.message || 'An error occurred while fetching user data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users (for discovery/matching)
  const getAllUsers = async () => {
   // setAllUsersLoading(true);
    setAllUsersError(null);
    
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) throw new Error('No authentication data');
      
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get("/userabout/get-all-users", { headers });
      
      if (response.data?.success) {
        setAllUsers(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch users');
      }
    } catch (error) {
      setAllUsersError(error.message);
    } finally {
      setAllUsersLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
    getAllUsers(); // Fetch all users when component mounts
    
  }, []);

  return (
    <UserDataContext.Provider value={{
      // Profile data
      userProfileData,
      setUserProfileData,
      
      // About data
      aboutData,
      setAboutData,

      // User looking for data
      userLookingForData,
      setUserLookingForData,

      // User profile
      userProfile,
      setUserProfile,

      // User games played data
      userGamesPlayedData,
      setUserGamesPlayedData,
      
      // All users data (for discovery/matching)
      allUsers,
      allUsersLoading,
      allUsersError,
      refreshAllUsers: getAllUsers,
      
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

