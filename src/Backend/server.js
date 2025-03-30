const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // For environment variables
const cors = require('cors');
const color = require('colors'); // For colored console logs
const morgan = require('morgan'); // For logging HTTP requests
const connectDB = require('./config/db'); // MongoDB connection file



dotenv.config();  // To load environment variables like JWT secret

// MongoDB connection (removed deprecated options)
connectDB ();


const app = express();



app.use(express.json());
app.use(morgan('dev')); // Use morgan for logging HTTP requests
app.use(cors());

// root route
app.use('/api/v1/auth', require('./routes/userRoute'));

const PORT = process.env.PORT || 8080; // Use environment variable or default to 5000


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgCyan.white.bold); // Log the server start message
});






















