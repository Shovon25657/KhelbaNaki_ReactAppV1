const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createprofileController,
  getProfileDataController,
  createAboutController,
  getAllAboutContoller,
  getUserAboutController,
  deleteAboutController,
  updateAboutDataController,
  getAboutDataController,
  updateprofileController,
  createUserLookingForDataController,
  getUserLookingForDataController,
  updateUserLookingForDataController
} = require("../controllers/userAboutController");
const { addGamesPlayedController, getGamesPlayedController, removeGameController,  } = require("../controllers/userGamesPlayedController");
const getUserProfileController = require("../controllers/getUserProfileController");

//router object
const router = express.Router();

// CREATE POST || POST
router.post("/create-about", requireSingIn, createAboutController);
router.post("/create-profile", requireSingIn, createprofileController);
router.post("/create-gamesplayed", requireSingIn, addGamesPlayedController);
router.post("/create-looking-for", requireSingIn, createUserLookingForDataController);



// CREATE GET || GET
//get about
router.get("/get-profile-data", requireSingIn, getProfileDataController);
router.get("/get-about-data", requireSingIn, getAboutDataController);
router.get("/get-gamesplayed", requireSingIn, getGamesPlayedController);
router.get("/get-user-profile", requireSingIn, getUserProfileController);
router.get("/get-user-looking-for", requireSingIn, getUserLookingForDataController);



// CREATE  UPDATE || UPDATE
//UPDATE || PUT
router.put("/update-profile-data", requireSingIn, updateprofileController);
router.put("/update-about-data", requireSingIn, updateAboutDataController);
router.put("/update-looking-for-data", requireSingIn, updateUserLookingForDataController);
router.delete("/delete-gamesplayed", removeGameController);

//export
module.exports = router;
