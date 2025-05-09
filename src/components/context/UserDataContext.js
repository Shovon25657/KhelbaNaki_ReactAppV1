
import React, { createContext, useState, useEffect, useCallback } from "react";
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
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const API_TIMEOUT = 10000; // 10 seconds

  const getUserData = useCallback(async () => {
    if (isFetching || loading) {
      console.log('Skipping getUserData: Fetch in progress');
      return;
    }
    // Skip if data is fresh
    if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION && userProfileData && aboutData && userLookingForData && userGamesPlayedData) {
      console.log('Skipping getUserData: Using cached data');
      return;
    }

    console.log('Fetching user data...');
    setIsFetching(true);
    setLoading(true);
    setError(null);

    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) {
        console.log('No auth data found in AsyncStorage');
        setLoading(false);
        setIsFetching(false);
        return;
      }

      const { token } = JSON.parse(authData);
      if (!token) {
        console.log('No token found in auth data');
        setLoading(false);
        setIsFetching(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const profileDataRes = await axios.get("/userabout/get-profile-data", { headers, signal: controller.signal });
        console.log('Profile data response:', profileDataRes.data);
        if (profileDataRes.data?.success) {
          setUserProfileData(profileDataRes.data.userProfileData);
          setUserProfile(profileDataRes.data.userProfileData);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }

      try {
        const aboutRes = await axios.get("/userabout/get-about-data", { headers, signal: controller.signal });
        console.log('About data response:', aboutRes.data);
        if (aboutRes.data?.success) {
          setAboutData(aboutRes.data.aboutData);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      }

      try {
        const userLookingForRes = await axios.get("/userabout/get-user-looking-for-data", { headers, signal: controller.signal });
        console.log('Looking for data response:', userLookingForRes.data);
        if (userLookingForRes.data?.success) {
          setUserLookingForData(userLookingForRes.data.userLookingForData);
        }
      } catch (err) {
        console.error('Error fetching looking for data:', err);
      }

      try {
        const userGamesPlayedRes = await axios.get("/userabout/get-user-gamesplayed-data", { headers, signal: controller.signal });
        console.log('Games played data response:', userGamesPlayedRes.data);
        if (userGamesPlayedRes.data?.success) {
          setUserGamesPlayedData(userGamesPlayedRes.data.gamesPlayed);
        }
      } catch (err) {
        console.error('Error fetching games played data:', err);
      }

      clearTimeout(timeoutId);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('Main error in getUserData:', error);
      setError(error.message || 'An error occurred while fetching user data');
    } finally {
      setLoading(false);
      setIsFetching(false);
      console.log('User data fetch complete');
    }
  }, [isFetching, loading, userProfileData, aboutData, userLookingForData, userGamesPlayedData, lastFetchTime]);

  const getAllUsers = useCallback(async () => {
    if (isFetching || allUsersLoading) {
      console.log('Skipping getAllUsers: Fetch in progress');
      return;
    }
    // Skip if data is fresh
    if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION && allUsers.length > 0) {
      console.log('Skipping getAllUsers: Using cached data');
      return;
    }

    console.log('Fetching all users...');
    setIsFetching(true);
    setAllUsersLoading(true);
    setAllUsersError(null);

    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) throw new Error('No authentication data');

      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await axios.get("/userabout/get-all-users", { headers, signal: controller.signal });

      if (response.data?.success) {
        setAllUsers(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch users');
      }

      clearTimeout(timeoutId);
      setLastFetchTime(Date.now());
    } catch (error) {
      setAllUsersError(error.message);
    } finally {
      setAllUsersLoading(false);
      setIsFetching(false);
      console.log('All users fetch complete');
    }
  }, [isFetching, allUsersLoading, allUsers, lastFetchTime]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await Promise.all([getUserData(), getAllUsers()]);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [getUserData, getAllUsers]);

  return (
    <UserDataContext.Provider value={{
      userProfileData,
      setUserProfileData,
      aboutData,
      setAboutData,
      userLookingForData,
      setUserLookingForData,
      userProfile,
      setUserProfile,
      userGamesPlayedData,
      setUserGamesPlayedData,
      allUsers,
      allUsersLoading,
      allUsersError,
      refreshAllUsers: getAllUsers,
      loading,
      error,
      refreshData: getUserData
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };
