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
  updateUserLookingForDataController,
  createUserGamesPlayedController,
  getUserGamesPlayedController,
  deleteGameController,
  likeUserController,
  dislikeUserController,
  getMatchesController,
  getPotentialMatchesController
} = require("../controllers/userAboutController");
const { getUserProfileController, getChatListController } = require("../controllers/getUserProfileController");


//router object
const router = express.Router();

// CREATE POST || POST
router.post("/create-about", requireSingIn, createAboutController);
router.post("/create-profile", requireSingIn, createprofileController);
router.post("/create-looking-for", requireSingIn, createUserLookingForDataController);
router.post("/create-usergamesplayed", requireSingIn, createUserGamesPlayedController);



// CREATE GET || GET
//get about
router.get("/get-profile-data", requireSingIn, getProfileDataController);
router.get("/get-about-data", requireSingIn, getAboutDataController);
router.get("/get-all-users", requireSingIn, getUserProfileController);
router.get("/get-user-looking-for-data", requireSingIn, getUserLookingForDataController);
router.get("/get-user-gamesplayed-data", requireSingIn, getUserGamesPlayedController);



// CREATE  UPDATE || UPDATE
//UPDATE || PUT
router.put("/update-profile-data", requireSingIn, updateprofileController);
router.put("/update-about-data", requireSingIn, updateAboutDataController);
router.put("/update-looking-for-data", requireSingIn, updateUserLookingForDataController);
router.delete("/delete-game/:gameId", requireSingIn, deleteGameController);
//export



// Match routes
router.post("/like-user", requireSingIn, likeUserController);
router.post("/dislike-user", requireSingIn, dislikeUserController);
router.get("/matches", requireSingIn, getMatchesController);
router.get("/potential-matches", requireSingIn, getPotentialMatchesController);
router.get("/chat-list", requireSingIn, getChatListController);






module.exports = router;
