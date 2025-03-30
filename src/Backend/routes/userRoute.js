const express = require("express");
const {registerController,loginController} = require("../controllers/userController");

const router = express.Router();

//route imports
router.post("/register", registerController);
router.post("/login", loginController);
// router.post("/forgot-password", forgotPasswordController);

module.exports = router;