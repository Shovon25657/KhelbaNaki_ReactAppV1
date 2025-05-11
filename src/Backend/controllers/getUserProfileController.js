const userProfileModel = require("../models/userProfileModel");
const User = require("../models/userModel");
const UserInteraction = require("../models/userInteractionModel"); // Add this line

const getUserProfileController = async (req, res) => {
  try {
    const currentUserId = req.auth._id;

    // Step 1: Get all users the current user has liked/disliked
    const interactions = await UserInteraction.find({ 
      user: currentUserId 
    }).select('targetUser');

    // Extract targetUser IDs and add current user to the exclusion list
    const excludedUserIds = interactions.map(i => i.targetUser);
    excludedUserIds.push(currentUserId);

    // Step 2: Fetch users NOT in excludedUserIds
    const otherUsers = await User.find({ 
      _id: { $nin: excludedUserIds } // Exclude interacted users + current user
    }).select('_id username');

    // Step 3: Get profiles of remaining users
    const userProfiles = await userProfileModel.find({
      user: { $in: otherUsers.map(u => u._id) }
    })
      .populate({
        path: 'user',
        select: '_id username'
      })
      .populate({
        path: 'gamesPlayed',
        select: 'gamesPlayed'
      })
      .sort({ createdAt: -1 });

    // Format the response (unchanged)
    const formattedUsers = userProfiles.map(profile => {
      const topGames = profile.gamesPlayed?.gamesPlayed || [];
      return {
        id: profile.user._id,
        username: profile.user.username,
        gamingName: profile.gamingName || profile.user.username,
        age: profile.age ? profile.age.toString() : 'Not specified',
        avatar: profile.avatar,
        games: topGames.slice(0, 3).map(game => game.playedGameName)
      };
    });

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers
    });

  } catch (error) {
    console.error("Error in getUserProfileController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profiles",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = getUserProfileController;