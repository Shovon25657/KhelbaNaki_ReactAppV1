const JWT = require("jsonwebtoken");
const usermodel = require("../models/userModel");
const { hashPassword, verifyPassword } = require("../helpers/authHelper");

// Register Controller
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
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
            name,
            email,
            password: hashedPassword, // Save the hashed password
        });

        await user.save(); // Save the new user to the database
        user.password = undefined; // Remove password from the response

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

module.exports = {
    registerController,
    loginController,
};
