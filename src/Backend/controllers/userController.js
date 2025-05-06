const JWT = require("jsonwebtoken");
const usermodel = require("../models/userModel");
const { hashPassword, verifyPassword } = require("../helpers/authHelper");
var { expressjwt: jwt } = require("express-jwt");
const userAboutModel = require("../models/userAboutModel");
const userProfileModel = require("../models/userProfileModel");
const userLookingForModel = require("../models/lookingFormodel");
const userGamesPlayedModel = require("../models/userGamesPlayedModel");

//middleware
const requireSingIn = jwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"],
});

// Register Controller
const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        // Simulate a database check for an existing user
        const existingUser = await usermodel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!",
            });
        }

        // Hash the password before saving (you can use bcrypt or any other library)
        const hashedPassword = await hashPassword(password);

        const user = new usermodel({
            username,
            email,
            password: hashedPassword, // Save the hashed password
        });

        await user.save(); // Save the new user to the database
        user.password = undefined; // Remove password from the response

        // Default about , profile data , Game Played Data
        const defaultAboutData = {
            educationQualification: "",
            location: "",
            smoking: "",
            drinks: "",
            religion: "",
            occupation: "",
            user: user._id,
        };

        const defaultProfileData = {
            bio: "",
            age: "",
            status: "",
            gamingName: "",
            user: user._id,
        };

        const defaultLookingForData = {
            availability: "",
            playMode: "",
            playStyle: "",
            user: user._id,
        };

        const defaultGamesPlayedData = {
            playedGameName: "",
            levelofGaming: "",
            frequency: "",
            user: user._id,
        };

        // Create default about and profile data for the user
        await userAboutModel.create(defaultAboutData);
        await userProfileModel.create(defaultProfileData);
        await userLookingForModel.create(defaultLookingForData);
        await userGamesPlayedModel.create(defaultGamesPlayedData);

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        // Check for existing user
        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist!",
            });
        }

        // Verify the password
        const isMatch = await verifyPassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials!",
            });
        }

        // Generate a token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d", // Token expires in 1 day
        });



        user.password = undefined; // Remove password from the response

        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user,
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};





const updateUserController = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required to update the user.",
            });
        }

        // Find the user by email
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Validate password length if provided
        if (password && password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        // Hash the new password 
        let hashedPassword;
        if (password) {
            hashedPassword = await hashPassword(password);
        }

        // Prepare update object
        const updateData = {
            username: username || user.username,
        };

        // Only update password if a new one is provided
        if (password) {
            updateData.password = hashedPassword;
        }

        // Perform the update
        const updatedUser = await usermodel.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true } 
        );

        updatedUser.password = undefined; 
        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            updatedUser,
        });
    } catch (error) {
        console.error("Error in user update:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user profile.",
            error: error.message,
        });
    }
};




module.exports = {
    requireSingIn,
    registerController,
    loginController,
    updateUserController
};
