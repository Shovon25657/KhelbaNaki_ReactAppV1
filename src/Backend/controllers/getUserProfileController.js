const userProfileModel = require("../models/userProfileModel");
const userGamesPlayedModel = require("../models/userGamesPlayedModel");

const getUserProfileController = async (req, res) => {
  try {
    const users = await userProfileModel.find({})
      .select('gamingName age avatar user')
      .populate({
        path: 'user',
        select: '_id username'
      })
      .populate({
        path: 'gamesPlayed',
        select: 'gamesPlayed -_id',
        model: userGamesPlayedModel,
        options: { limit: 3 }
      })
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user.user._id,
      gamingName: user.gamingName || user.user.username,
      age: user.age || 'Not specified',
      avatar: user.avatar,
      games: user.gamesPlayed?.gamesPlayed?.slice(0, 3).map(g => g.playedGameName) || []
    }));

    res.status(200).json({
      success: true,
      data: formattedUsers
    });

  } catch (error) {
    console.error("Error in getUserProfileController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users"
    });
  }
};

module.exports = getUserProfileController;