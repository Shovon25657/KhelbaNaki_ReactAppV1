const express = require("express");
const {registerController,loginController, updateUserController, requireSingIn} = require("../controllers/userController");


const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//UPDATE || PUT
router.put("/update-user", requireSingIn, updateUserController);
// router.put("about-update-user", createor)


module.exports = router;