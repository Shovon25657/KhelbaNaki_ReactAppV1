const userProfileModel = require("../models/userProfileModel");

const getUserProfileController = async (req, res) => {
  try {
    // Get profiles with virtual populate
    const users = await userProfileModel.find({})
      .populate({
        path: 'user',
        select: '_id username'
      })
      .populate({
        path: 'gamesPlayed', // This uses the virtual we defined
        select: 'gamesPlayed'
      })
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => {
      // Get the top 3 games if available
      const topGames = user.gamesPlayed?.gamesPlayed || [];
      
      return {
        id: user.user._id,
        gamingName: user.gamingName || user.user.username,
        age: user.age ? user.age.toString() : 'Not specified',
        avatar: user.avatar,
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