const UserAbout = require("../models/userAboutModel");
const User = require("../models/userModel");

// Create or update userAbout (depending on whether the user already has an entry)
const createOrUpdateUserAbout = async (req, res) => {
    try {
        const { userId, bio, educationQualification, smoking, drinks, gender, religion, occupation, lookingFor, bestAt, gamerSubscription } = req.body;

        if (!userId || !bio || !educationQualification || !smoking || !drinks || !gender || !religion || !occupation || !lookingFor || !bestAt || !gamerSubscription) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        // Check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Check if the user has an existing userAbout entry
        let userAbout = await UserAbout.findOne({ user: userId });

        if (userAbout) {
            // Update the existing entry
            userAbout = await UserAbout.findByIdAndUpdate(userAbout._id, {
                bio,
                educationQualification,
                smoking,
                drinks,
                gender,
                religion,
                occupation,
                lookingFor,
                bestAt,
                gamerSubscription
            }, { new: true });

            return res.status(200).json({
                message: "User bio updated successfully",
                userAbout
            });
        } else {
            // Create a new userAbout entry
            userAbout = new UserAbout({
                user: userId,
                bio,
                educationQualification,
                smoking,
                drinks,
                gender,
                religion,
                occupation,
                lookingFor,
                bestAt,
                gamerSubscription
            });

            await userAbout.save();
            return res.status(201).json({
                message: "User bio created successfully",
                userAbout
            });
        }
    } catch (error) {
        console.error("Error creating/updating user bio:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get userAbout by userId
const getUserAbout = async (req, res) => {
    try {
        const { userId } = req.params;

        const userAbout = await UserAbout.findOne({ user: userId });

        if (!userAbout) {
            return res.status(404).json({ message: "User bio not found" });
        }

        return res.status(200).json(userAbout);
    } catch (error) {
        console.error("Error fetching user bio:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createOrUpdateUserAbout,
    getUserAbout
};
