const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createprofileController,
  getProfileDataController,
  getAllAboutContoller,
  getUserAboutController,
  deleteAboutController,
  updateAboutController,
  getAboutDataController,
} = require("../controllers/userAboutController");
const { addGamesPlayedController, getGamesPlayedController, removeGameController } = require("../controllers/userGamesPlayedController");

//router object
const router = express.Router();

// CREATE POST || POST
//router.post("/create-about", requireSingIn, createAboutController);
router.post("/create-profile", requireSingIn, createprofileController);
router.post("/create-gamesplayed", addGamesPlayedController);


// CREATE GET || GET
//get about
router.get("/get-profile", getProfileDataController);
router.get("/get-gamesplayed", getGamesPlayedController);

// CREATE  UPDATE || UPDATE
router.delete("/delete-gamesplayed", removeGameController);

//export
module.exports = router;
