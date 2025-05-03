// getUserProfileController.js
const userProfileModel = require("../models/userProfileModel");
const userAboutModel = require("../models/userAboutModel");

/**
 * @desc    Get list of user profiles with combined data from both profile and about models
 * @route   GET /api/user-profiles
 * @access  Private (uses requireSignIn middleware)
 */
const getUserProfileController = async (req, res) => {
  try {
    // Fetch all user profiles with selected fields and populate user id
    const userProfiles = await userProfileModel.find({})
      .select('gamingName age bio')
      .populate({
        path: 'user',
        select: '_id' // Only get the user's id
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!userProfiles || userProfiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user profiles found",
        data: []
      });
    }

    // Get all about data for these users in a single query
    const userIds = userProfiles.map(profile => profile.user._id);
    const userAboutData = await userAboutModel.find({ 
      user: { $in: userIds } 
    }).select('user occupation location gender religion');

    // Create a map for quick lookup of about data by user ID
    const aboutDataMap = new Map();
    userAboutData.forEach(about => {
      aboutDataMap.set(about.user.toString(), about);
    });

    // Combine data from both models
    const profiles = userProfiles.map(profile => {
      const aboutData = aboutDataMap.get(profile.user._id.toString()) || {};
      
      return {
        id: profile.user._id,
        gamingName: profile.gamingName || 'Not specified',
        age: profile.age || 'Not specified',
        bio: profile.bio || 'Not specified',
        occupation: aboutData.occupation || 'Not specified',
        location: aboutData.location || 'Not specified',
        gender: aboutData.gender || 'Not specified',
        religion: aboutData.religion || 'Not specified'
      };
    });

    return res.status(200).json({
      success: true,
      message: "User profiles retrieved successfully",
      count: profiles.length,
      data: profiles
    });

  } catch (error) {
    console.error("Error in getUserProfileController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profiles",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = getUserProfileController;