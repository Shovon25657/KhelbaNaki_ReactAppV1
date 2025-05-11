// UserDataContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
  // Existing state
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
  
  // New state for interactions
  const [matches, setMatches] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [unseenMatches, setUnseenMatches] = useState(0);

  // Existing function to get user data
  const getUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };

      // Existing data fetching logic
      const profileDataRes = await axios.get("/userabout/get-profile-data", { headers });
      if (profileDataRes.data?.success) setUserProfileData(profileDataRes.data.userProfileData);

      const aboutRes = await axios.get("/userabout/get-about-data", { headers });
      if (aboutRes.data?.success) setAboutData(aboutRes.data.aboutData);

      const userProfileRes = await axios.get("/userabout/get-profile-data", { headers });
      if (userProfileRes.data?.success) setUserProfile(userProfileRes.data.userProfile);

      const userLookingForRes = await axios.get("/userabout/get-user-looking-for-data", { headers });
      if (userLookingForRes.data?.success) setUserLookingForData(userLookingForRes.data.userLookingForData);

      const userGamesPlayedRes = await axios.get("/userabout/get-user-gamesplayed-data", { headers });
      if (userGamesPlayedRes.data?.success) setUserGamesPlayedData(userGamesPlayedRes.data.gamesPlayed);

    } catch (error) {
      console.error('Main error in getUserData:', error);
      setError(error.message || 'An error occurred while fetching user data');
    } finally {
      setLoading(false);
    }
  };

  // Fixed refreshAllUsers function
  const refreshAllUsers = async () => {
    setAllUsersLoading(true);
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

  // Like user function
  const likeUser = async (targetUserId) => {
    try {
      const authData = await AsyncStorage.getItem('@auth');
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post("/userabout/like-user", 
        { targetUserId }, 
        { headers }
      );

      if (response.data?.success) {
        setInteractions(prev => [...prev, { user: targetUserId, action: 'like' }]);
        
        if (response.data.match) {
          setMatches(prev => [...prev, response.data.match]);
          setUnseenMatches(prev => prev + 1);
          return { isMatch: true, match: response.data.match };
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Like error:', error);
      throw error;
    }
  };

  // Dislike user function
  const dislikeUser = async (targetUserId) => {
    try {
      const authData = await AsyncStorage.getItem('@auth');
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post("/userabout/dislike-user", 
        { targetUserId }, 
        { headers }
      );

      setInteractions(prev => [...prev, { user: targetUserId, action: 'dislike' }]);
      return { success: true };
    } catch (error) {
      console.error('Dislike error:', error);
      throw error;
    }
  };

  // Refresh matches
  const refreshMatches = async () => {
    try {
      const authData = await AsyncStorage.getItem('@auth');
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get("/userabout/matches", { headers });
      if (response.data?.success) {
        setMatches(response.data.matches);
        setUnseenMatches(response.data.matches.filter(m => !m.seen).length);
      }
    } catch (error) {
      console.error('Match refresh error:', error);
    }
  };

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
      
      // All users data
      allUsers,
      allUsersLoading,
      allUsersError,
      refreshAllUsers, // This was missing
      
      // Matching system
      matches,
      interactions,
      unseenMatches,
      likeUser,
      dislikeUser,
      refreshMatches,
      
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