const userAboutModel = require("../models/userAboutModel");
const userProfileModel = require("../models/userProfileModel");
const JWT = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");


//Create About
const createAboutController = async ( req,res) => {
      try {
        const {  educationQualification, location, smoking, drinks, gender, religion, occupation } = req.body;
        //validate
        if ( !educationQualification || !location ||  !smoking || !drinks  || !gender || !religion || !occupation ) {
          return res.status(500).send({
            sucess: false,
            message: "Please Provide All Fields",
          });
        }

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
        if (!bio || !age || !gamingName ) {
          return res.status(500).send({
            sucess: false,
            message: "Please Provide All Fields",
          });
        }

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
    // Check for Authorization header
    let token = req.headers.authorization;

    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Token not provided",
      });
    }

    // Ensure token starts with "Bearer"
    if (token.startsWith("Bearer ")) {
      // Extract token
      token = token.split(" ")[1];
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid token format. Token must start with 'Bearer '",
      });
    }

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY || "");
    console.log("Decoded Token: ", decoded);

    // Find the user profile
    const profileData = await userProfileModel.find({user: decoded._id });
    console.log('User ID:', decoded._id);
  
 
    if (!profileData) {
      return res.status(404).send({
        success: false,
        message: "Profile not found",
      });
    }

    console.log('Data', profileData);

    res.status(200).send({
      success: true,
      message: 'Profile Data',
      profileData
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in GetProfileData",
      error: error.message,
    });
  }
};



module.exports = {createAboutController, createprofileController, getProfileDataController };