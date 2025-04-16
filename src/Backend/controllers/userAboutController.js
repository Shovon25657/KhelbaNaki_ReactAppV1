const userAboutModel = require("../models/userAboutModel");


//Create About
const createAboutController = async ( req,res) => {
      try {
        const { bio, educationQualification, smoking, drinks, gender, religion, occupation, lookingFor, bestAt, gamerSubscription} = req.body;
        //validate
        if (!bio || !educationQualification || !smoking || !drinks  || !gender || !religion || !occupation || !lookingFor || !bestAt || !gamerSubscription) {
          return res.status(500).send({
            sucess: false,
            message: "Please Provide All Fields",
          });
        }
        const post = await userAboutModel({
          bio,
          educationQualification,
          smoking,
          drinks,
          gender,
          religion,
          occupation,
          lookingFor,
          bestAt,
          gamerSubscription,
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

module.exports = {createAboutController};