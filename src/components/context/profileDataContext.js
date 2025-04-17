import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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
      const { data } = await axios.get("/userabout/get-profile");
      setLoading(false);
      setProfileData(data?.profileData);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // inintal  posts
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
