const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createAboutController,
  getAllAboutContoller,
  getUserAboutController,
  deleteAboutController,
  updateAboutController,
} = require("../controllers/userAboutController");

//router object
const router = express.Router();

// CREATE POST || POST
router.post("/create-about", requireSingIn, createAboutController);


//export
module.exports = router;
