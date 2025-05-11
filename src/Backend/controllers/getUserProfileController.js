const userProfileModel = require("../models/userProfileModel");
const User = require("../models/userModel");
const UserInteraction = require("../models/userInteractionModel"); // Add this line
const Match = require("../models/matchModel");
const UserProfile = require("../models/userProfileModel");



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




const getChatListController = async (req, res) => {
  try {
    const currentUserId = req.auth._id;

    // Fetch active matches sorted by last message time
    const matches = await Match.find({
      $or: [{ user1: currentUserId }, { user2: currentUserId }],
      isActive: true
    })
      .populate('user1', 'username')
      .populate('user2', 'username')
      .sort({ lastMessageAt: -1 }); // Sort by recent activity

    // Extract and deduplicate user IDs (exclude current user)
    const userIds = matches.flatMap(match => [
      match.user1._id,
      match.user2._id
    ]);
    const uniqueUserIds = [...new Set(userIds)].filter(id => !id.equals(currentUserId));

    // Fetch profiles for matched users
    const profiles = await UserProfile.find({ user: { $in: uniqueUserIds } });
    const profileMap = new Map(profiles.map(p => [p.user.toString(), p]));

    // Build chat list
    const chatList = matches.map(match => {
      const isCurrentUser1 = match.user1._id.equals(currentUserId);
      const otherUser = isCurrentUser1 ? match.user2 : match.user1;
      const profile = profileMap.get(otherUser._id.toString());

      return {
        matchId: match._id,
        userId: otherUser._id,
        username: otherUser.username,
        gamingName: profile?.gamingName || otherUser.username,
        avatar: profile?.avatar || '',
        lastMessage: match.lastMessage,
        lastMessageAt: match.lastMessageAt,
        matchedAt: match.matchedAt
      };
    });

    res.status(200).json({ success: true, data: chatList });
  } catch (error) {
    console.error('Error fetching chat list:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat list',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};




module.exports = { getUserProfileController
  , getChatListController };