const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createAboutController,
  createprofileController,
  getProfileDataController,
  getAllAboutContoller,
  getUserAboutController,
  deleteAboutController,
  updateAboutController,
  getAboutDataController,
} = require("../controllers/userAboutController");

//router object
const router = express.Router();

// CREATE POST || POST
//router.post("/create-about", requireSingIn, createAboutController);
router.post("/create-profile", requireSingIn, createprofileController);




//get about
router.get("/get-profile", getProfileDataController);

//export
module.exports = router;
