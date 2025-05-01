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
} = require("../controllers/userAboutController");
const { addGamesPlayedController, getGamesPlayedController, removeGameController,  } = require("../controllers/userGamesPlayedController");

//router object
const router = express.Router();

// CREATE POST || POST
router.post("/create-about", requireSingIn, createAboutController);
router.post("/create-profile", requireSingIn, createprofileController);
router.post("/create-gamesplayed", requireSingIn, addGamesPlayedController);


// CREATE GET || GET
//get about
router.get("/get-profile", requireSingIn, getProfileDataController);
router.get("/get-about", requireSingIn, getAboutDataController);
router.get("/get-gamesplayed", requireSingIn, getGamesPlayedController);

// CREATE  UPDATE || UPDATE
//UPDATE || PUT
router.put("/update-profile", requireSingIn, updateprofileController);
router.put("/update-about", requireSingIn, updateAboutDataController);
router.delete("/delete-gamesplayed", removeGameController);

//export
module.exports = router;
