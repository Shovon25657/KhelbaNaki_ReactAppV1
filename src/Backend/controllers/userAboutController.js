const userAboutModel = require("../models/userAboutModel");
const userProfileModel = require("../models/userProfileModel");
const userLookingForModel = require("../models/lookingFormodel");
const userGamesPlayedModel = require("../models/userGamesPlayedModel");
const JWT = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");


//Create About
const createAboutController = async (req, res) => {
  try {
    const { educationQualification, location, smoking, drinks, gender, religion, occupation } = req.body;
    //validate
    // if ( !educationQualification || !location ||  !smoking || !drinks || !religion || !occupation ) {
    //   return res.status(500).send({
    //     sucess: false,
    //     message: "Please Provide All Fields",
    //   });
    // }

    // Simulate a database check for an existing Data
    const existingAboutData = await userAboutModel.findOne({ user: req.auth._id });

    if (existingAboutData) {
      return res.status(400).json({
        success: false,
        message: "Data already exists!",
      });
    }
    const userAboutData = await userAboutModel({

      educationQualification,
      location,
      smoking,
      drinks,
      gender,
      religion,
      occupation,
      user: req.auth._id,
    }).save();
    res.status(201).send({
      success: true,
      message: "UserAboutData Created Successfully",
      userAboutData,
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



//Get AboutData
const getAboutDataController = async (req, res) => {
  try {
    const aboutData = await userAboutModel.findOne({ user: req.auth._id });

    if (!aboutData) {
      return res.status(404).send({
        success: false,
        message: "About data not found",
      });
    }

    res.status(200).send({
      success: true,
      message: 'About Data',
      aboutData
    });
  } catch (error) {
    console.error("Error in GetAboutData:", error);
    res.status(500).send({
      success: false,
      message: "Error in GetAboutData",
      error: error.message,
    });
  }
}

//Update About
const updateAboutDataController = async (req, res) => {
  try {
    const { educationQualification, location, smoking, drinks, gender, religion, occupation } = req.body;
    // Find profile by user ID (not params.id for security)
    const aboutData = await userAboutModel.findOne({ user: req.auth._id });


    // Validate at least one field is being updated
    if (!educationQualification && !location && !smoking && !drinks && !gender && !religion && !occupation) {
      return res.status(500).send({
        success: false,
        message: "Please provide at least one field to update",
      });
    }


    // Check if profile exists
    if (!aboutData) {
      return res.status(404).send({
        success: false,
        message: "AboutData not found",
      });
    }

    // Update only the provided fields
    const updatedFields = {};
    if (educationQualification !== undefined) updatedFields.educationQualification = educationQualification;
    if (location !== undefined) updatedFields.location = location;
    if (smoking !== undefined) updatedFields.smoking = smoking;
    if (drinks !== undefined) updatedFields.drinks = drinks;
    if (gender !== undefined) updatedFields.gender = gender;
    if (religion !== undefined) updatedFields.religion = religion;
    if (occupation !== undefined) updatedFields.occupation = occupation;



    const updatedAboutData = await userAboutModel.findOneAndUpdate(
      { user: req.auth._id },
      {
        educationQualification: updatedFields.educationQualification || aboutData?.educationQualification,
        location: updatedFields.location || aboutData?.location,
        smoking: updatedFields.smoking || aboutData?.smoking,
        drinks: updatedFields.drinks || aboutData?.drinks,
        gender: updatedFields.gender || aboutData?.gender,
        religion: updatedFields.religion || aboutData?.religion,
        occupation: updatedFields.occupation || aboutData?.occupation,
        // Add other fields as needed
      },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      success: true,
      message: "AboutData Updated Successfully",
      updatedAboutData,
    });
  } catch (error) {
    console.error("Error in update AboutData:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating AboutData",
      error: error.message, // Send only the error message in production
    });
  }
};









//Create Profile
const createprofileController = async (req, res) => {
  try {
    const { bio, age, gamingName } = req.body;
    //validate
    // if (!bio || !age || !gamingName ) {
    //   return res.status(500).send({
    //     sucess: false,
    //     message: "Please Provide All Fields",
    //   });
    // }

    // Simulate a database check for an existing Data
    const existingProfileData = await userProfileModel.findOne({ user: req.auth._id });

    if (existingProfileData) {
      return res.status(400).json({
        success: false,
        message: "ProfileData already exists!",
      });
    }

    const userProfileData = await userProfileModel({
      bio,
      gamingName,
      age,
      user: req.auth._id
    }).save();
    res.status(201).send({
      success: true,
      message: "ProfileData Created Successfully",
      userProfileData,
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




//Get ProfileData
const getProfileDataController = async (req, res) => {
  try {
    const userProfileData = await userProfileModel.findOne({ user: req.auth._id });

    if (!userProfileData) {
      return res.status(404).send({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).send({
      success: true,
      message: 'Profile Data',
      userProfileData
    });
  } catch (error) {
    console.error("Error in GetProfileData:", error);
    res.status(500).send({
      success: false,
      message: "Error in GetProfileData",
      error: error.message,
    });
  }
};




//UPDATE PROFILE
const updateprofileController = async (req, res) => {
  try {
    const { bio, age, gamingName } = req.body;
    // Find profile by user ID (not params.id for security)
    const userProfile = await userProfileModel.findOne({ user: req.auth._id });


    // Validate at least one field is being updated
    if (!bio && !age && !gamingName) {
      return res.status(500).send({
        success: false,
        message: "Please provide at least one field to update",
      });
    }


    // Check if profile exists
    if (!userProfile) {
      return res.status(404).send({
        success: false,
        message: "Profile not found",
      });
    }

    // Update only the provided fields
    const updatedFields = {};
    if (bio !== undefined) updatedFields.bio = bio;
    if (age !== undefined) updatedFields.age = age;
    if (gamingName !== undefined) updatedFields.gamingName = gamingName;

    const updatedProfile = await userProfileModel.findOneAndUpdate(
      { user: req.auth._id },
      {
        bio: updatedFields.bio || userProfile?.bio,
        age: updatedFields.age || userProfile?.age,
        gamingName: updatedFields.gamingName || userProfile?.gamingName
      },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error in update profile:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating profile",
      error: error.message, // Send only the error message in production
    });
  }
};



//Create lookingFor
const createUserLookingForDataController = async (req, res) => {
  try {
    const { availability, playMode, playStyle } = req.body;

    // Simulate a database check for an existing Data
    const existingUserLookingForData = await userLookingForModel.findOne({ user: req.auth._id });

    if (existingUserLookingForData) {
      return res.status(400).json({
        success: false,
        message: "Data already exists!",
      });

    }
    const userLookingForData = await userLookingForModel({

      availability,
      playMode,
      playStyle,
      user: req.auth._id,
    }).save();
    res.status(201).send({
      success: true,
      message: "Looking For Data Created Successfully",
      userLookingForData,
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


//Get LookingForData
const getUserLookingForDataController = async (req, res) => {
  try {
    const userLookingForData = await userLookingForModel.findOne({ user: req.auth._id });

    if (!userLookingForData) {
      return res.status(404).send({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).send({
      success: true,
      message: 'Looking For Data',
      userLookingForData
    });
  } catch (error) {
    console.error("Error in GetLookingForData:", error);
    res.status(500).send({
      success: false,
      message: "Error in GetLookingForData",
      error: error.message,
    });
  }
};



//Update LookingFor
const updateUserLookingForDataController = async (req, res) => {
  try {
    const { availability, playMode, playStyle } = req.body;
    // Find profile by user ID (not params.id for security)
    const userLookingForData = await userLookingForModel.findOne({ user: req.auth._id });


    // Validate at least one field is being updated
    if (!availability && !playMode && !playStyle) {
      return res.status(500).send({
        success: false,
        message: "Please provide at least one field to update",
      });
    }


    // Check if profile exists
    if (!userLookingForData) {
      return res.status(404).send({
        success: false,
        message: "Looking For Data not found",
      });
    }

    // Update only the provided fields
    const updatedFields = {};
    if (availability !== undefined) updatedFields.availability = availability;
    if (playMode !== undefined) updatedFields.playMode = playMode;
    if (playStyle !== undefined) updatedFields.playStyle = playStyle;

    const updatedUserLookingForData = await userLookingForModel.findOneAndUpdate(
      { user: req.auth._id },
      {
        availability: updatedFields.availability || userLookingForData?.availability,
        playMode: updatedFields.playMode || userLookingForData?.playMode,
        playStyle: updatedFields.playStyle || userLookingForData?.playStyle
      },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      success: true,
      message: "Looking For Data Updated Successfully",
      updatedUserLookingForData,
    });
  } catch (error) {
    console.error("Error in update Looking For Data:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating Looking For Data",
      error: error.message, // Send only the error message in production
    });
  }
};




const createUserGamesPlayedController = async (req, res) => {
  try {
    // Authentication check
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login first",
      });
    }

    const { gamesPlayed } = req.body;

    // Validation
    if (!gamesPlayed || !Array.isArray(gamesPlayed)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid games array",
      });
    }

    // Validate each game object
    const invalidGames = gamesPlayed.filter(game => 
      !game.playedGameName || 
      !game.levelofGaming || 
      !game.frequency
    );

    if (invalidGames.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Each game must have playedGameName, levelofGaming, and frequency",
        invalidGames
      });
    }

    // Find or create user's game data
    let userGamesData = await userGamesPlayedModel.findOne({ user: req.auth._id });

    if (userGamesData) {
      // Filter out duplicates (case insensitive)
      const newGames = gamesPlayed.filter(newGame => 
        !userGamesData.gamesPlayed.some(existingGame =>
          existingGame.playedGameName.toLowerCase() === newGame.playedGameName.toLowerCase()
        )
      );

      if (newGames.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No new games to add",
          gamesPlayed: userGamesData.gamesPlayed
        });
      }

      userGamesData.gamesPlayed.push(...newGames);
      await userGamesData.save();

      return res.status(200).json({
        success: true,
        message: "Games updated successfully",
        gamesPlayed: userGamesData.gamesPlayed
      });
    }

    // Create new entry
    userGamesData = await userGamesPlayedModel.create({
      gamesPlayed,
      user: req.auth._id
    });

    return res.status(201).json({
      success: true,
      message: "Games added successfully",
      gamesPlayed: userGamesData.gamesPlayed
    });

  } catch (error) {
    console.error("Error in game controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


//Get User Games Played
const getUserGamesPlayedController = async (req, res) => {
  try {
    const gamesPlayed = await userGamesPlayedModel.findOne({ user: req.auth._id });

    if (!gamesPlayed) {
      return res.status(404).send({
        success: false,
        message: "User Games Played data not found",
      });
    }

    res.status(200).send({
      success: true,
      message: 'User Games Played data',
      gamesPlayed
    });
  } catch (error) {
    console.error("Error in User Games Played data:", error);
    res.status(500).send({
      success: false,
      message: "Error in User Games Played data",
      error: error.message,
    });
  }
}

























module.exports = {
  createAboutController,
  getAboutDataController,
  updateAboutDataController,
  createprofileController,
  getProfileDataController,
  updateprofileController,
  createUserLookingForDataController,
  getUserLookingForDataController,
  updateUserLookingForDataController,
  createUserGamesPlayedController,
  getUserGamesPlayedController
};