const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'Name is required'],
        trim: true,
    },
    gamingname: {
        type: String,
        trim: true,
    },
    dob: {
        type: String,
        required: [true,'dob is required'],
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,

        required: [true,'Password is required'],
    },
    role: {
        type: String,
        default: 'gamer',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);