const bcrypt = require('bcryptjs');

// Hashing function to "encrypt" password
exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};


// Comparing function to "decrypt" password
exports.verifyPassword = async (enteredPassword, storedHash) => {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, storedHash);
        return isMatch; // returns true if passwords match, false otherwise
    } catch (error) {
        throw new Error('Error verifying password');
    }
};

