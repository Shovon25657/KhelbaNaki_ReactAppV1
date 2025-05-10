// Games Played Controller

const userAboutModel = require("../models/userAboutModel");
const userProfileModel = require("../models/userProfileModel");
const JWT = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");
const userGamesPlayedModel = require("../models/userGamesPlayedModel");

// Add Games to User's GamesPlayed
// const addGamesPlayedController = async (req, res) => {
//     try {
//         const { games } = req.body;
        
//         // Validate
//         if (!games || !Array.isArray(games) || games.length === 0) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Please provide at least one game in an array",
//             });
//         }

//         // Check if user already has games data
//         const existingGamesData = await userAboutModel.findOne({ user: req.auth._id });

//         if (existingGamesData) {
//             // Update existing games array (merge and avoid duplicates)
//             const updatedGames = [...new Set([...existingGamesData.gamesPlayed, ...games])];
            
//             const updatedData = await userAboutModel.findByIdAndUpdate(
//                 existingGamesData._id,
//                 { gamesPlayed: updatedGames },
//                 { new: true }
//             );

//             return res.status(200).send({
//                 success: true,
//                 message: "Games updated successfully",
//                 gamesPlayed: updatedData.gamesPlayed,
//             });
//         }

//         // Create new entry if doesn't exist
//         const newGamesData = await userAboutModel({
//             gamesPlayed: games,
//             user: req.auth._id,
//         }).save();

//         res.status(201).send({
//             success: true,
//             message: "Games added successfully",
//             gamesPlayed: newGamesData.gamesPlayed,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error in Add Games API",
//             error: error.message,
//         });
//     }
// };


//Create Profile
const addGamesPlayedController = async ( req,res) => {
      try {
        
        if (!req.auth || !req.auth._id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized - Please login first",
            });
        }
        
        const { gamesPlayed} = req.body;
        
        //validate
        if (!gamesPlayed || !Array.isArray(gamesPlayed) || gamesPlayed.length === 0) {
          return res.status(500).send({
            sucess: false,
            message: "Please Provide All Fields",
          });
        }

  // Simulate a database check for an existing Data
  const existingGamesData = await userGamesPlayedModel.findOne({ user: req.auth._id });
        
  if (existingGamesData) {
    // Update existing games array (merge and avoid duplicates)
    const updatedGames = [...new Set([...existingGamesData.gamesPlayed, ...gamesPlayed])];
    
    const updatedData = await userGamesPlayedModel.findByIdAndUpdate(
        existingGamesData._id,
        { gamesPlayed: updatedGames },
        { new: true }
    );

    return res.status(200).send({
        success: true,
        message: "Games updated successfully",
        gamesPlayed: updatedData.gamesPlayed,
    });
}

   //  Create new entry if doesn't exist
     const newGamesData = await userGamesPlayedModel({
             gamesPlayed: gamesPlayed ,
             user: req.auth._id,
         }).save();

        res.status(201).send({
            success: true,
            message: "Games added successfully",
            gamesPlayed: newGamesData.gamesPlayed,
        });

        console.log(req);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          sucess: true,
          message: "Error in Create Post APi",
          error,
        });
      }
};





// Get User's GamesPlayed
const getGamesPlayedController = async (req, res) => {
    try {
        // Find the user's games
        const gamesData = await userAboutModel.findOne(
            { user: req.auth._id },
            { gamesPlayed: 1 } // Only return gamesPlayed field
        );

        if (!gamesData) {
            return res.status(404).send({
                success: false,
                message: "No games data found for this user",
            });
        }

        res.status(200).send({
            success: true,
            message: "Games retrieved successfully",
            gamesPlayed: gamesData.gamesPlayed || [],
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get Games API",
            error: error.message,
        });
    }
};

// Remove Game from User's GamesPlayed
const removeGameController = async (req, res) => {
    try {
        const { game } = req.body;
        
        if (!game) {
            return res.status(400).send({
                success: false,
                message: "Please provide a game to remove",
            });
        }

        const userGamesData = await userAboutModel.findOne({ user: req.auth._id });

        if (!userGamesData) {
            return res.status(404).send({
                success: false,
                message: "No games data found for this user",
            });
        }

        // Filter out the game to be removed
        const updatedGames = userGamesData.gamesPlayed.filter(
            g => g.toLowerCase() !== game.toLowerCase()
        );

        // Update the document
        const updatedData = await userAboutModel.findByIdAndUpdate(
            userGamesData._id,
            { gamesPlayed: updatedGames },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Game removed successfully",
            gamesPlayed: updatedData.gamesPlayed,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Remove Game API",
            error: error.message,
        });
    }
};

module.exports = {
    addGamesPlayedController,
    getGamesPlayedController,
    removeGameController
};