const userAboutModel = require("../models/userAboutModel");
const userProfileModel = require("../models/userProfileModel");
const JWT = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");


//Create About
const createAboutController = async ( req,res) => {
      try {
        const {  educationQualification, location, smoking, drinks, gender, religion, occupation } = req.body;
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
        const post = await userAboutModel({
    
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
          message: "Post Created Successfully",
          post,
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


//Create Profile
const createprofileController = async ( req,res) => {
      try {
        const { bio, age, gamingName} = req.body;
        //validate
        // if (!bio || !age || !gamingName ) {
        //   return res.status(500).send({
        //     sucess: false,
        //     message: "Please Provide All Fields",
        //   });
        // }

  // Simulate a database check for an existing Data
  const existingAboutData = await userProfileModel.findOne({ user: req.auth._id });
        
  if (existingAboutData) {
      return res.status(400).json({
          success: false,
          message: "Data already exists!",
      });
  }

        const post = await userProfileModel({
          bio,
          gamingName,
          age,
          user: req.auth._id
        }).save();
        res.status(201).send({
          success: true,
          message: "ProfileData Created Successfully",
          post,
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


//Create lookingFor






//Get ProfileData

const getProfileDataController = async (req, res) => {
  try {
    const profileData = await userProfileModel.findOne({ user: req.auth._id });

    if (!profileData) {
      return res.status(404).send({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).send({
      success: true,
      message: 'Profile Data',
      profileData
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


 




















module.exports = {createAboutController, createprofileController, getProfileDataController, updateprofileController, };