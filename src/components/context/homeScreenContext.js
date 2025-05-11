import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDataContext } from './UserDataContext';

const HomeScreenContext = createContext();

const HomeScreenProvider = ({ children }) => {
  const { userProfile, refreshData } = useContext(UserDataContext);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch potential matches for the home screen
  const fetchPotentialMatches = async () => {
    setLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      const response = await axios.get("/matches/potential", { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (response.data?.success) {
        setProfiles(response.data.profiles);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Transform profile data for display
  const transformProfileData = (profile) => {
    if (!profile) return null;
    
    const games = profile.gamesPlayed?.gamesPlayed?.slice(0, 3).map(g => g.playedGameName) || [];
    
    return {
      id: profile.user?._id || profile._id,
      gamingName: profile.gamingName || 'Anonymous',
      age: profile.age || 'Not specified',
      games: games,
      image: [person1, person2, person3][Math.floor(Math.random() * 3)] // Random placeholder image
    };
  };

  // Handle like action
  const handleLike = async (profileId) => {
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      await axios.post("/matches/like", { profileId }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // Update UI or state as needed
    } catch (err) {
      console.error("Error liking profile:", err);
    }
  };

  // Handle dislike action
  const handleDislike = async (profileId) => {
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) return;
      
      const { token } = JSON.parse(authData);
      await axios.post("/matches/dislike", { profileId }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // Update UI or state as needed
    } catch (err) {
      console.error("Error disliking profile:", err);
    }
  };

  // Refresh home screen data
  const refreshHomeData = () => {
    fetchPotentialMatches();
    refreshData();
  };

  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  return (
    <HomeScreenContext.Provider value={{
      profiles,
      currentIndex,
      setCurrentIndex,
      isTransitioning,
      setIsTransitioning,
      loading,
      error,
      handleLike,
      handleDislike,
      refreshHomeData,
      transformProfileData
    }}>
      {children}
    </HomeScreenContext.Provider>
  );
};

export { HomeScreenContext, HomeScreenProvider };