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
  const [matches, setMatches] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [unseenMatches, setUnseenMatches] = useState(0);
  const [messages, setMessages] = useState({}); // Store messages by matchId

  const getAuthHeaders = async () => {
    const authData = await AsyncStorage.getItem('@auth');
    if (!authData) return null;
    const { token } = JSON.parse(authData);
    return { Authorization: `Bearer ${token}` };
  };

  // Existing data fetching
  const getUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const responses = await Promise.all([
        axios.get("/userabout/get-profile-data", { headers }),
        axios.get("/userabout/get-about-data", { headers }),
        axios.get("/userabout/get-user-looking-for-data", { headers }),
        axios.get("/userabout/get-user-gamesplayed-data", { headers })
      ]);

      if (responses[0].data?.success) setUserProfileData(responses[0].data.userProfileData);
      if (responses[1].data?.success) setAboutData(responses[1].data.aboutData);
      if (responses[2].data?.success) setUserLookingForData(responses[2].data.userLookingForData);
      if (responses[3].data?.success) setUserGamesPlayedData(responses[3].data.gamesPlayed);

    } catch (error) {
      console.error('Main error in getUserData:', error);
      setError(error.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Message related functions
  const fetchMessages = async (matchId) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return [];

      const response = await axios.get(`/userabout/messages/${matchId}`, { headers });
      
      if (response.data?.success) {
        setMessages(prev => ({
          ...prev,
          [matchId]: response.data.messages.map(msg => ({
            ...msg,
            read: msg.read || msg.sender._id === msg.receiver // Ensure read status is accurate
          }))
        }));
        return response.data.messages;
      }
      return [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };

  const markMessagesAsRead = async (matchId) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return false;

      const response = await axios.post('/userabout/messages/read', { matchId }, { headers });
      if (response.data?.success) {
        // Update local messages state to reflect read status
        setMessages(prev => ({
          ...prev,
          [matchId]: prev[matchId]?.map(msg => ({
            ...msg,
            read: true
          })) || []
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  };

  const refreshMatches = async () => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const response = await axios.get("/userabout/chat-list", { headers });
      if (response.data?.success) {
        setMatches(response.data.data);
        const newMatches = response.data.data.filter(match => 
          !matches.some(existingMatch => existingMatch._id === match._id)
        );
        setUnseenMatches(prev => prev + newMatches.length);
      }
    } catch (error) {
      console.error('Match refresh error:', error);
    }
  };

  const likeUser = async (targetUserId) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

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

  const dislikeUser = async (targetUserId) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

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

  const refreshAllUsers = async () => {
    setAllUsersLoading(true);
    setAllUsersError(null);
    
    try {
      const headers = await getAuthHeaders();
      if (!headers) throw new Error('No authentication data');
      
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

      // Games played data
      userGamesPlayedData,
      setUserGamesPlayedData,
      
      // User list
      allUsers,
      allUsersLoading,
      allUsersError,
      refreshAllUsers,

      // Matching system
      matches,
      interactions,
      unseenMatches,
      setUnseenMatches,
      likeUser,
      dislikeUser,
      refreshMatches,

      // Messaging system
      messages,
      fetchMessages,
      markMessagesAsRead,

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